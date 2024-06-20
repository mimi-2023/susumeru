from fastapi import status, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from api.schemas.user import UserResponse
from api.models import User


# ユーザー名を変更
async def update_username(db: AsyncSession, user_id: str, new_name: str):
    result = await db.scalars(select(User).filter(User.id == user_id))
    user = result.first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="認証できません"
            )
    user.name = new_name

    db.add(user)
    await db.commit()
    await db.refresh(user)

    return UserResponse.model_validate(user)