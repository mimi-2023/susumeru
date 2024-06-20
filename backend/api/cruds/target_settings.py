from datetime import date, timedelta
from fastapi import status, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from api.schemas.target_settings import UpdateTargetRequest, UpdateTargetResponse
from api.models import Book, Progress, Target_setting


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
