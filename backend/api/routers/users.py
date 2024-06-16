from typing import Annotated
from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from api.cruds import auth as auth_cruds, users as users_cruds
from api.schemas import auth as auth_schemas
from api.database import get_db


router = APIRouter(prefix="/users", tags=["Users"])

DbDependency = Annotated[AsyncSession, Depends(get_db)]
FormDependency = Annotated[OAuth2PasswordRequestForm, Depends()]
UserDependency = Annotated[auth_schemas.CurrentUser, Depends(auth_cruds.get_current_user)]


@router.get("/hello")
async def hello(db: DbDependency, user: UserDependency):
    return await users_cruds.hello(db, user.id)

@router.get("/hello2")
async def hello2(user: UserDependency):
    return await users_cruds.hello2(user)