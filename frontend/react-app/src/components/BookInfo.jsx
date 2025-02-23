import { useState } from "react";
import dayjs from 'dayjs';
import pencilIcon from "../assets/pencil.svg";

const BookInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 仮のデータ
  const firstPage = 20;
  const lastPage = 252;
  const target = 25;
  const targetFinishDate = dayjs("2024/05/20");

  return (
    <>
      <div className="bg-white w-full max-w-[360px] min-h-[100px] rounded-2xl shadow-lg">
        <div className="flex items-center mx-auto min-h-[100px] w-5/6">
          <div className="flex justify-between gap-5 items-start w-full">
            <div className="w-full">
              <div className="flex justify-between">
                <p>本文</p>
                <p>{lastPage - firstPage + 1}ページ（{firstPage}～{lastPage}）</p>
              </div>
              <div className="flex justify-between">
                <p>目標ページ数</p>
                <p>{target}ページ／日</p>
              </div>
              <div className="flex justify-between">
                <p>目標完了日</p>
                <p>{targetFinishDate.format('YYYY[年]M[月]D[日]')}</p>
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