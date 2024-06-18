from fastapi import status, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from api.schemas import user as user_schemas
from api.models import User


async def hello(db: AsyncSession, id):
    result = await db.scalars(select(User).filter(User.id == id))
    user = result.first()
    return f"Hello, {user.name}! You are wellcome!"

async def hello2():
    return f"Hello! You are verry wellcome!"


# ユーザー名を変更
async def update_username(db: AsyncSession, id: str, new_name: str):
    result = await db.scalars(select(User).filter(User.id == id))
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

    return user_schemas.UserResponse.model_validate(user)