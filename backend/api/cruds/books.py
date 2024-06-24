from datetime import date
from fastapi import status, HTTPException
from sqlalchemy import select, func
from sqlalchemy.orm import aliased
from sqlalchemy.ext.asyncio import AsyncSession
from api.schemas.books import GetBookResponse, RegisterRequest, RegisterResponse
from api.models import Book, Progress, Target_setting


# 本の情報リストを取得
async def get_books_list(db: AsyncSession, user_id: str):
    # 同じtarget_settingsテーブル同士でjoinするためにaliasを作成
    TS1 = aliased(Target_setting)
    TS2 = aliased(Target_setting)

    # book_idと、book_id毎の最新start_dateをselectするサブクエリTS_subqueryを作成
    TS_subquery = (
        select(TS1.book_id, func.max(TS1.start_date).label('latest_start_date'))
        .group_by(TS1.book_id)
        .subquery()
    )

    # target_settingsにTS_subqueryをjoin
    # book_id毎の最新targetレコードをselectするサブクエリlatest_targetを作成
    latest_target = (
        select(TS2)
        .join(TS_subquery, 
              (TS2.book_id == TS_subquery.c.book_id) & 
              (TS2.start_date == TS_subquery.c.latest_start_date))
        .subquery()
    )

    # 同じprogressesテーブル同士でjoinするためにaliasを作成
    P1 = aliased(Progress)
    P2 = aliased(Progress)

    # book_idと、book_id毎の最新record_dateをselectするサブクエリP_subqueryを作成
    P_subquery = (
        select(P1.book_id, func.max(P1.record_date).label('latest_record_date'))
        .group_by(P1.book_id)
        .subquery()
    )

    # progressesにP_subqueryをjoin
    # book_idとbook_id毎の最新record_date,current_pageをselectするサブクエリlatest_progressを作成
    latest_progress = (
        select(P2.book_id, P2.record_date, P2.current_page)
        .join(P_subquery, 
              (P2.book_id == P_subquery.c.book_id) & 
              (P2.record_date == P_subquery.c.latest_record_date))
        .subquery()
    )

    # booksテーブルに、latest_target、latest_progressの2つのサブクエリをouterjoin
    # use_idが一致するbookレコードとtarget情報,current_pageを、record_dateの降順に並び替えて取得
    result = await db.execute(
        select(Book, 
               latest_target.c.start_date, latest_target.c.target_pages, latest_target.c.start_page, 
               latest_progress.c.current_page
               )
        .outerjoin(latest_target, Book.id == latest_target.c.book_id)
        .outerjoin(latest_progress, Book.id == latest_progress.c.book_id)
        .filter(Book.user_id == user_id)
        .order_by(latest_progress.c.record_date.desc())
        )
    books = result.all()
    
    # GetBookResponseを作成し、response_listに追加してreturn
    response_list = []
    for book, target_startdate, target_pages, target_startpage, current_page in books:
        # progressがなくcurrent_pageがNoneの場合は、first_pageをcurrent_pageとする
        if not current_page:
            current_page = book.first_page
        data = GetBookResponse(
            book_id = book.id,
            title = book.title,
            first_page = book.first_page,
            last_page = book.last_page,
            latest_target = target_pages,
            latest_target_startdate = target_startdate,
            latest_target_startpage = target_startpage,
            latest_current_page = current_page,        
        )
        response_list.append(data)
    
    return response_list


# 本の情報を単独で取得
async def get_book(db: AsyncSession, user_id: str, book_id: int):
    # 指定されたbook_idの最新targetレコードをselectするサブクエリlatest_targetを作成
    latest_target = (
        select(Target_setting)
        .filter(Target_setting.book_id == book_id)
        .order_by(Target_setting.start_date.desc())
        .limit(1)
        .subquery()
    )
    # 指定されたbook_idとその最新record_date,current_pageをselectするサブクエリlatest_progressを作成
    latest_progress = (
        select(Progress)
        .filter(Progress.book_id == book_id)
        .order_by(Progress.record_date.desc())
        .limit(1)
        .subquery()
    )

    # booksテーブルに、latest_target、latest_progressの2つのサブクエリをouterjoin
    # 指定されたbook_idとuser_idが一致するbookレコードとその最新target情報,current_pageを取得
    result = await db.execute(
        select(Book, 
               latest_target.c.start_date, latest_target.c.target_pages, latest_target.c.start_page, 
               latest_progress.c.current_page
               )
        .outerjoin(latest_target, Book.id == latest_target.c.book_id)
        .outerjoin(latest_progress, Book.id == latest_progress.c.book_id)
        .filter(Book.id == book_id, Book.user_id == user_id)
        )
    book_data = result.first()

    if not book_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="認証できません"
            )
    
    # 取得したbook_dataをunpack
    book, target_startdate, target_pages, target_startpage, current_page = book_data

    # progressがなくcurrent_pageがNoneの場合は、first_pageをcurrent_pageとする
    if not current_page:
        current_page = book.first_page

    # GetBookResponseを作成してreturn
    return GetBookResponse(
        book_id = book.id,
        title = book.title,
        first_page = book.first_page,
        last_page = book.last_page,
        latest_target = target_pages,
        latest_target_startdate = target_startdate,
        latest_target_startpage = target_startpage,
        latest_current_page = current_page,        
    )


# 本を登録する
async def creat_book(db: AsyncSession, user_id: str, request: RegisterRequest):
    try:
        # Bookテーブルにデータを挿入
        new_book = Book(
            user_id = user_id,
            title = request.title,
            first_page = request.first_page,
            last_page = request.last_page
            )
        db.add(new_book)
        await db.flush()  # データベースに変更を反映し、new_book.idを生成

        # Target_settingテーブルにデータを挿入
        new_target_setting = Target_setting(
            book_id = new_book.id,
            start_date = date.today(),
            target_pages = request.target_pages,
            start_page = request.first_page
        )
        db.add(new_target_setting)

        await db.commit()  # トランザクションをコミット
        await db.refresh(new_book)

    except Exception:
        await db.rollback()  # エラー発生時はロールバック
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="本の登録に失敗しました"
            ) 
        
    return RegisterResponse.model_validate(new_book)

