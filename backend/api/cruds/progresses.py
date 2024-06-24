from datetime import date, timedelta
from fastapi import status, HTTPException
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from api.schemas.progresses import ProgressData, GetProgressResponse, AddProgressResponse
from api.models import Book, Progress, Target_setting


# 指定された日付を含む1週間分のprogress,target_pagesを取得
async def get_week_progresses(
        db: AsyncSession, user_id: str, book_id: int, record_date: date
        ):
    # 該当のbook_id, user_idを持つbookレコードのcreated_atを取得
    result = await db.scalars(
        select(Book.created_at)
        .filter(Book.id == book_id, Book.user_id == user_id)
        )
    book_created_at = result.first()
    # レコードが存在しなければ認証エラー
    if not book_created_at:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="認証できません"
            )
    # 本の登録日<=record_date<=今日でなければ、日付エラー
    if not (book_created_at.date() <= record_date <= date.today()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="日付が不正です"
            )
    
    # 指定されたrecord_dateを含む週の開始日（日曜日）と終了日（土曜日）を指定
    weekday = record_date.weekday()
    sunday_date = (record_date - timedelta(days=weekday + 1)) if weekday != 6 else record_date
    saturday_date = sunday_date + timedelta(days=6)

    # 指定期間内のprogressesレコードを、record_dateの昇順で取得
    result = await db.scalars(
        select(Progress)
        .filter(
            Progress.book_id == book_id, 
            Progress.record_date.between(sunday_date, saturday_date)
        )
        .order_by(Progress.record_date)
    )
    progresses = result.all()

    # 期間より前で一番新しいstart_dateを取得するサブクエリ
    before_sunday_date = (
        select(Target_setting.start_date)
        .filter(
            Target_setting.book_id == book_id,
            Target_setting.start_date < sunday_date
        )
        .order_by(Target_setting.start_date.desc())
        .limit(1)
        .subquery()
    )
    # 指定期間とサブクエリbefore_sunday_dateとのOR条件で、target_settingsをstart_dateの降順で取得
    result = await db.execute(
        select(Target_setting.start_date, Target_setting.target_pages)
        .filter(Target_setting.book_id == book_id,
                or_(
                    Target_setting.start_date.between(sunday_date, saturday_date),
                    Target_setting.start_date == before_sunday_date
                )
        )
        .order_by(Target_setting.start_date.desc())
    )
    target_settings = result.all()

    week_progresses = []

    # ProgressDataを作成し、week_progressesに追加
    for i in range(7):
        day = sunday_date + timedelta(days=i)
        # 該当する日付のprogress_pageを取得
        for progress in progresses:
            if progress.record_date == day:
                progressed_pages = progress.progressed_pages
                break
        # 該当する日付のprogress_pageがなければ０
        else:
            progressed_pages = 0
        
        # 降順のtarget_settingsのstart_dateと比較していき、該当するtarget_pagesを取得
        for start_date, target_pages in target_settings:
            if start_date <= day:
                target = target_pages
                break
        # 該当するtarget_settingsがなければ０
        else:
            target = 0
        
        progress_data = ProgressData(
            record_date = day,
            progressed_pages = progressed_pages,
            target_pages = target
            )
        week_progresses.append(progress_data)

    return GetProgressResponse(
        book_id=book_id, week_progresses=week_progresses
        )            


# progressを追加する
async def add_progress(
        db: AsyncSession, user_id: str, book_id: int, record_date: date, current_page: int
        ):
    # 該当のbook_id, user_idを持つbookレコードを取得し、存在しなければ認証エラーを返す
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

    # 日付が、latest_progress<=record_date<=今日であることを確認
    if not (latest_progress.record_date <= record_date <= date.today()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="日付が不正です"
            )
    # current_pageが、latest_progress<request<=最終ページであることを確認
    if not (latest_progress.current_page < current_page <= book.last_page):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ページ位置が不正です"
            )
    
    # requestとlatest_progressの日付が同じ場合、progressed_pagesを加算してlatest_progressを上書きする
    if record_date == latest_progress.record_date:
        latest_progress.progressed_pages += current_page - latest_progress.current_page
        latest_progress.current_page = current_page
        db.add(latest_progress)
        await db.commit()
        await db.refresh(latest_progress)

        return AddProgressResponse.model_validate(latest_progress)
    
    # requestとlatest_progressの日付が異なる場合、新しいprogressを追加する
    else:
        new_progress = Progress(
            book_id = book_id,
            record_date = record_date,
            current_page = current_page,
            progressed_pages = current_page - latest_progress.current_page
        )
        db.add(new_progress)
        await db.commit()
        await db.refresh(new_progress)

        return AddProgressResponse.model_validate(new_progress)