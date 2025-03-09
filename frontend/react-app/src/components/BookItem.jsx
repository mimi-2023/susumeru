import { useState } from "react";
import { progressPercent, finishDate } from "../repositories/utils";
import BookTitle from "./BookTitle";
import BookInfo from "./BookInfo";
import dayjs from "dayjs";

const BookItem = ({ book }) => {
  // 進捗率
  const progress = progressPercent({
    currentPage: book.latest_current_page, 
    firstPage: book.first_page, 
    lastPage: book.last_page,
  });
  
  // 本の情報
  const [bookInfo, setBookInfo] = useState({
    bookId: book.book_id,
    firstPage: book.first_page,
    lastPage: book.last_page,
    currentPage: book.latest_current_page,
    targetPages: book.latest_target,
    finishDate: finishDate({
      startDate: dayjs(book.latest_target_startdate), 
      startPage: book.latest_target_startpage, 
      lastPage: book.last_page, 
      targetPages: book.latest_target,
    }),
  });
  
  // 目標ページ数のstate更新（APIレスポンスを使用）
  const updateTargetPages = (data) => {
    setBookInfo(prev => ({ 
      ...prev,
      targetPages: data.target_pages,
      finishDate: finishDate({
        startDate: dayjs(data.start_date), 
        startPage: data.start_page,
        lastPage: book.last_page, 
        targetPages: data.target_pages, 
      })
    }));
  };

  
  return (
    <>
      <BookTitle title={book.title} progress={progress} />
      <BookInfo bookInfo={bookInfo} updateTargetPages={updateTargetPages} />
    </>
  )
};

export default BookItem;