from typing import Annotated
from fastapi import APIRouter, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from api.cruds.auth import get_current_user
from api.cruds import user as user_cruds
from api.schemas.auth import CurrentUser
from api.schemas.user import UserRequest, UserResponse
from api.database import get_db


router = APIRouter(prefix="/user", tags=["User"])

DbDependency = Annotated[AsyncSession, Depends(get_db)]
UserDependency = Annotated[CurrentUser, Depends(get_current_user)]


@router.get("/hello")
async def hello(db: DbDependency, user: UserDependency):
    return await user_cruds.hello(db, user.id)

@router.get("/hello2")
async def hello2(user: UserDependency):
    return await user_cruds.hello2()


@router.get(
    "", response_model=UserResponse, status_code=status.HTTP_200_OK
    )
async def get_user(user: UserDependency):
    return UserResponse.model_validate(user)


@router.put(
    "", response_model=UserResponse, status_code=status.HTTP_200_OK
    )
async def update_user(
    db: DbDependency, user: UserDependency, request: UserRequest
    ):
    return await user_cruds.update_username(db, user_id=user.id, new_name=request.name)