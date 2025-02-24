

// 進捗率
export const progressPercent = ({ currentPage, firstPage, lastPage }) => 
  Math.floor(
  (currentPage - firstPage + 1) / (lastPage - firstPage + 1) * 100
);
  
// 目標完了日（dayjsオブジェクト→dayjsオブジェクト）
export const finishDate = ({ startDate, startPage, lastPage, targetPages }) => 
  startDate
  .add(Math.ceil((lastPage - startPage) / targetPages) - 1, 'day');
