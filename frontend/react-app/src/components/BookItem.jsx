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
  
  const updateBookInfo = (newTargetPages) => {
    setBookInfo(prev => ({ 
      ...prev, 
      targetPages: newTargetPages,
      finishDate: finishDate({
        startDate: dayjs(), 
        startPage: book.latest_current_page,  // current_pageが変わらなければこれで良い。変更時は未対応。
        lastPage: book.last_page, 
        targetPages: newTargetPages, 
      })
    }));
  };

  
  return (
    <>
      <BookTitle title={book.title} progress={progress} />
      <BookInfo bookInfo={bookInfo} onUpdate={updateBookInfo} />
    </>
  )
};

export default BookItem;