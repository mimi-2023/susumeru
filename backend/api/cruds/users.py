from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from api.models import User


async def hello(db: AsyncSession, id):
    result = await db.scalars(select(User).filter(User.id == id))
    user = result.first()
    return f"Hello, {user.name}! You are wellcome!"

async def hello2(user):
    return f"Hello, {user.name}! You are verry wellcome!"