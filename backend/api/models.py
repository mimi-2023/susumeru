from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, PrimaryKeyConstraint
from api.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True)
    name = Column(String(64), nullable=False)
    email = Column(String(64), nullable=False, unique=True)
    password = Column(String(225), nullable=False)
    salt = Column(String(225), nullable=False)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now())


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
        )
    title = Column(String(225), nullable=False)
    first_page = Column(Integer, nullable=False)
    last_page = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now())


class Target_setting(Base):
    __tablename__ = "target_settings"

    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"))
    start_date = Column(Date)
    target_pages = Column(Integer, nullable=False)
    start_page = Column(Integer, nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint('book_id', 'start_date'),
    )


class Progress(Base):
    __tablename__ = "progresses"

    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"))
    date = Column(Date)
    current_page = Column(Integer, nullable=False)
    progressed_pages = Column(Integer, nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint('book_id', 'date'),
    )

