from typing import Annotated
from fastapi import APIRouter, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from api.cruds import books as books_cruds 
from api.cruds.auth import get_current_user
from api.schemas.auth import CurrentUser
from api.schemas.books import GetBookResponse, RegisterRequest, RegisterResponse
from api.database import get_db


router = APIRouter(prefix="/books", tags=["Books"])

DbDependency = Annotated[AsyncSession, Depends(get_db)]
UserDependency = Annotated[CurrentUser, Depends(get_current_user)]

# listが空だとどうなる？
@router.get(
    "", response_model=list[GetBookResponse], status_code=status.HTTP_200_OK
    )
async def get_books(
    db: DbDependency, user: UserDependency
    ):
    return await books_cruds.get_books(db, user.id)


@router.post(
    "/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED
    )
async def register(
    db: DbDependency, user: UserDependency, request: RegisterRequest
    ):
    return await books_cruds.creat_book(db, user.id, request)
