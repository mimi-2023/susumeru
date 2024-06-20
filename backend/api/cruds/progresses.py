from datetime import date
from fastapi import status, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from api.schemas.progresses import AddProgressRequest, AddProgressResponse   
from api.models import Book, Progress, Target_setting


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