from datetime import date, timedelta
from fastapi import status, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from api.schemas.books import (
    RegisterRequest, RegisterResponse, 
    AddProgressRequest, AddProgressResponse, 
    UpdateTargetRequest, UpdateTargetResponse)
from api.models import Book, Progress, Target_setting


# 本を登録する
async def creat_book(db: AsyncSession, user_id: str, request: RegisterRequest):
        try:
            # Bookテーブルにデータを挿入
            new_book = Book(
                user_id = user_id,
                title = request.title,
                first_page = request.first_page,
                last_page = request.last_page
                )
            db.add(new_book)
            await db.flush()  # データベースに変更を反映し、new_book.idを生成

            # Target_settingテーブルにデータを挿入
            new_target_setting = Target_setting(
                book_id = new_book.id,
                start_date = date.today(),
                target_pages = request.target_pages,
                start_page = request.first_page
            )
            db.add(new_target_setting)

            await db.commit()  # トランザクションをコミット
            await db.refresh(new_book)

        except Exception:
            await db.rollback()  # エラー発生時はロールバック
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="本の登録に失敗しました"
                ) 
        
        return RegisterResponse.model_validate(new_book)


# progressを追加する
async def add_progress(
        db: AsyncSession, user_id: str, book_id: int, request: AddProgressRequest
        ):
    # 該当のbook_id, user_idを持つbookレコードを取得
    result = await db.scalars(
        select(Book)
        .filter(Book.id == book_id, Book.user_id == user_id)
        )
    book = result.first()
    if not book:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="認証できません"
            )
    
    # 本の最新のprogressレコードを取得
    result = await db.scalars(
        select(Progress)
        .filter(Progress.book_id == book_id)
        .order_by(Progress.record_date.desc())
        )
    latest_progress = result.first()
    # progressレコードがない場合は、最新のtarget_settingを取得して仮のlatest_progressを作成
    if not latest_progress:
        result = await db.scalars(
            select(Target_setting)
            .filter(Target_setting.book_id == book_id)
            .order_by(Target_setting.start_date.desc())
            )
        latest_target = result.first()
        latest_progress = Progress(
            book_id = book_id,
            record_date = latest_target.start_date,
            current_page = latest_target.start_page,
            progressed_pages = 0
        )

    # 日付が、latest_progress<=request<=今日であることを確認
    if not (latest_progress.record_date <= request.record_date <= date.today()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="日付が不正です"
            )
    # current_pageが、latest_progress<request<=最終ページであることを確認
    if not (latest_progress.current_page < request.current_page <= book.last_page):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ページ位置が不正です"
            )
    
    # requestとlatest_progressの日付が同じ場合、progressed_pagesを加算してlatest_progressを上書きする
    if request.record_date == latest_progress.record_date:
        latest_progress.progressed_pages += request.current_page - latest_progress.current_page
        latest_progress.current_page = request.current_page
        db.add(latest_progress)
        await db.commit()
        await db.refresh(latest_progress)

        return AddProgressResponse.model_validate(latest_progress)
    
    # requestとlatest_progressの日付が異なる場合、新しいprogressを追加する
    else:
        new_progress = Progress(
            book_id = book_id,
            record_date = request.record_date,
            current_page = request.current_page,
            progressed_pages = request.current_page - latest_progress.current_page
        )
        db.add(new_progress)
        await db.commit()
        await db.refresh(new_progress)

        return AddProgressResponse.model_validate(new_progress)


# ページ目標を変更
async def update_target_setting(
        db: AsyncSession, user_id: str, book_id: int, request: UpdateTargetRequest
        ):
    # 該当のbook_id, user_idを持つbookレコードのuser_idを取得
    result = await db.scalars(
        select(Book.user_id)
        .filter(Book.id == book_id, Book.user_id == user_id)
        )
    book_user_id = result.first()
    if not book_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="認証できません"
            )
    
    # 昨日以前のprogressesの中から、最新のcurrent_pageを取得
    yesterday_date = date.today() - timedelta(days=1)
    result = await db.scalars(
        select(Progress.current_page)
        .filter(Progress.book_id == book_id, Progress.record_date <= yesterday_date)
        .order_by(Progress.record_date.desc())
        )
    current_page = result.first()

    # 最新のtarget_settingを取得
    result = await db.scalars(
        select(Target_setting)
        .filter(Target_setting.book_id == book_id)
        .order_by(Target_setting.start_date.desc())
        )
    latest_target = result.first()

    # 昨日以前のprogressesがない場合→最新のtarget_settingのstart_pageをcurrent_pageとする
    if not current_page:
        current_page = latest_target.start_page

    # latest_targetの日付が今日の場合→start_pageとtarget_pagesを上書きして保存
    if latest_target.start_date == date.today():
        latest_target.target_pages = request.target_pages
        latest_target.start_page = current_page
        db.add(latest_target)
        await db.commit()
        await db.refresh(latest_target)

        return UpdateTargetResponse.model_validate(latest_target)
    
    # latest_targetの日付が昨日以前の場合→new_targetを作成
    else:
        new_target = Target_setting(
            book_id = book_id,
            start_date = date.today(),
            target_pages = request.target_pages,
            start_page = current_page
        )
        db.add(new_target)
        await db.commit()
        await db.refresh(new_target)

        return UpdateTargetResponse.model_validate(new_target)
