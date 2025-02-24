import { useState } from "react";
import pencilIcon from "../assets/pencil.svg";

const BookInfo = ({ bookInfo, updateBookInfo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white w-full max-w-[360px] min-h-[100px] rounded-2xl shadow-lg">
        <div className="flex items-center mx-auto min-h-[100px] w-5/6">
          <div className="flex justify-between gap-5 items-start w-full">
            <div className="w-full">
              <div className="flex justify-between">
                <p>本文</p>
                <p>{bookInfo.lastPage - bookInfo.firstPage + 1}ページ（{bookInfo.firstPage}～{bookInfo.lastPage}）</p>
              </div>
              <div className="flex justify-between">
                <p>目標ページ数</p>
                <p>{bookInfo.targetPages}ページ／日</p>
              </div>
              <div className="flex justify-between">
                <p>目標完了日</p>
                <p>{bookInfo.finishDate.format('YYYY[年]M[月]D[日]')}</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setIsModalOpen(true)}
              className="transition hover:opacity-40"
              >
              <img src={pencilIcon} alt="本の情報を編集する" />
            </button>          
          </div>     
        </div>
      </div>
    </>
  )
};

export default BookInfo;