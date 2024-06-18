from typing import Annotated
from fastapi import APIRouter, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from api.cruds import auth as auth_cruds, user as user_cruds
from api.schemas import auth as auth_schemas, user as user_schemas
from api.database import get_db


router = APIRouter(prefix="/user", tags=["User"])

DbDependency = Annotated[AsyncSession, Depends(get_db)]
UserDependency = Annotated[auth_schemas.CurrentUser, Depends(auth_cruds.get_current_user)]


@router.get("/hello")
async def hello(db: DbDependency, user: UserDependency):
    return await user_cruds.hello(db, user.id)

@router.get("/hello2")
async def hello2(user: UserDependency):
    return await user_cruds.hello2()


@router.get(
    "", response_model=user_schemas.UserResponse, status_code=status.HTTP_200_OK
    )
async def get_user(user: UserDependency):
    return user_schemas.UserResponse.model_validate(user)


@router.put(
    "", response_model=user_schemas.UserResponse, status_code=status.HTTP_200_OK
    )
async def update_user(
    db: DbDependency, user: UserDependency, request: user_schemas.UserRequest
    ):
    return await user_cruds.update_username(db, id=user.id, new_name=request.name)