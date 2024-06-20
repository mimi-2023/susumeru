from datetime import date
from fastapi import status, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from api.schemas.books import RegisterRequest, RegisterResponse
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

