

// 進捗率
export const progressPercent = ({ currentPage, firstPage, lastPage }) => 
  Math.floor(
  (currentPage - firstPage + 1) / (lastPage - firstPage + 1) * 100
);
  
// 目標完了日（dayjsオブジェクト→dayjsオブジェクト）
export const finishDate = ({ startDate, startPage, lastPage, targetPages }) => {
  const calcFinishDate = startDate
  .add(Math.ceil((lastPage - startPage) / targetPages) - 1, 'day');
  // 数値が未入力（Invalid Date）または完了日が開始日より前の日付になる時は、falseを返す
  if (!calcFinishDate.isValid() || calcFinishDate < startDate) return false;
  return calcFinishDate;
};
  
