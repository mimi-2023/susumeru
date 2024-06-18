from typing import Annotated
from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from api.cruds import auth as auth_cruds, books as books_cruds
from api.schemas import auth as auth_schemas, books as books_schemas
from api.database import get_db


router = APIRouter(prefix="/books", tags=["Books"])

DbDependency = Annotated[AsyncSession, Depends(get_db)]
UserDependency = Annotated[auth_schemas.CurrentUser, Depends(auth_cruds.get_current_user)]


@router.post(
    "/register", response_model=books_schemas.RegisterResponse, status_code=status.HTTP_201_CREATED
    )
async def register(
    db: DbDependency, user: UserDependency, request: books_schemas.RegisterRequest
    ):
    return await books_cruds.creat_book(db, user.id, request)