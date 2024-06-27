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


@router.post(
    "", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED
    )
async def creat_book(
    db: DbDependency, user: UserDependency, request: RegisterRequest
    ):
    return await books_cruds.creat_book(db, user.id, request)


@router.get(
    "", response_model=list[GetBookResponse], status_code=status.HTTP_200_OK
    )
async def get_books_list(
    db: DbDependency, user: UserDependency
    ):
    return await books_cruds.get_books_list(db, user.id)


@router.get(
    "/{book_id}", response_model=GetBookResponse, status_code=status.HTTP_200_OK
    )
async def get_book(
    db: DbDependency, user: UserDependency, book_id
    ):
    return await books_cruds.get_book(db, user.id, book_id)

