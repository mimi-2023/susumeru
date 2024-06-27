from datetime import date
from typing import Annotated
from fastapi import APIRouter, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from api.cruds import progresses as progresses_cruds 
from api.cruds.auth import get_current_user
from api.schemas.auth import CurrentUser
from api.schemas.progresses import GetProgressResponse, AddProgressRequest, AddProgressResponse
from api.database import get_db


router = APIRouter(prefix="/progresses", tags=["Progresses"])

DbDependency = Annotated[AsyncSession, Depends(get_db)]
UserDependency = Annotated[CurrentUser, Depends(get_current_user)]


@router.get(
    "/{book_id}/{record_date}", response_model=GetProgressResponse, status_code=status.HTTP_200_OK
    )
async def get_week_progresses(
    db: DbDependency, user: UserDependency, book_id: int, record_date: date
    ):
    return await progresses_cruds.get_week_progresses(db, user.id, book_id, record_date)


@router.put(
    "/{book_id}/{record_date}", response_model=AddProgressResponse, status_code=status.HTTP_200_OK
    )
async def add_progress(
    db: DbDependency, user: UserDependency, book_id: int, record_date: date, request: AddProgressRequest
    ):
    return await progresses_cruds.add_progress(db, user.id, book_id, record_date, request.current_page)