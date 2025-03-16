import { useContext } from "react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { toast } from 'react-toastify';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { SessionContext } from '../repositories/SessionProvider';
import { updateTargetPagesRequest } from "../repositories/Requests";
import { finishDate } from "../repositories/utils";
import pencilIcon from "../assets/pencil.svg";


// eslint-disable-next-line react/prop-types
const UpdateTargetPages = ({ 
  isModalOpen, setIsModalOpen, bookInfo, updateTargetPages 
}) => {
  // 入力フォームのバリデーション
  const updateTargetPagesSchema = z
    .object({
      newTargetPages: z.coerce
        .number()
        .int("1以上の整数で入力して下さい")
        .gte(1, "1以上の整数で入力して下さい")
        .lte(100000),
    });
  
  const token = localStorage.getItem("access_token");
  const { setCurrentUser } = useContext(SessionContext);
  const { 
      register, watch, handleSubmit, reset, formState: { errors } 
    } = useForm({ mode: "onSubmit", resolver: zodResolver(updateTargetPagesSchema), });

  // 新しい目標完了日を計算する
  const watchTargetPages = watch("newTargetPages", bookInfo.targetPages);
  const newFinishDate = finishDate({
      startDate: dayjs(), 
      startPage: bookInfo.currentPage, 
      lastPage: bookInfo.lastPage, 
      targetPages: watchTargetPages,
    });

  // モーダルを閉じる
  const onModalClose = (event) => {
    event.stopPropagation();
    reset();
    setIsModalOpen(false);
  };
  
  // 目標ページ数の変更処理
  const handleUpdateTargetPages = async(data) => {
    try {     
      const result = await updateTargetPagesRequest(token, bookInfo.bookId, data.newTargetPages);
      updateTargetPages(result.data);
      toast.success("目標ページ数を変更しました");
      onModalClose();
    } catch (error) {
      if (error.response.status == 401) {
        // 401"Unauthorized"のHTTPステータスがレスポンスで返ってきた場合→サインアウト
        toast.warning("認証に失敗しました");
        localStorage.removeItem("access_token");
        setCurrentUser(null);     
      } else if (error.response) {
        // 2xxと401以外のHTTPステータスがレスポンスで返ってきた場合
        toast.error("登録に失敗しました");     
      } else {
        // レスポンスがない場合
        toast.error("通信エラーです");
      }
    }  
  };

  return isModalOpen ? (
    <>
      <div className="bg-myPaleBlue absolute z-30 w-[340px] min-h-[260px] rounded-2xl shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="mx-auto py-8 w-5/6 space-y-8">
          <div className="flex items-center gap-2 text-myDeepBlue font-extrabold">
            <img src={pencilIcon} alt="pencil" className="size-6" />
            <p>目標ページ数を変更する</p>
          </div>
          <form onSubmit={handleSubmit(handleUpdateTargetPages)} className="space-y-8">
            <div className="space-y-2 text-sm">
              <label htmlFor="newTargetPages">
                新しい目標ページ数（1日あたり）
              </label>
              <input
                {...register("newTargetPages")} 
                id="newTargetPages" 
                type="number" 
                required
                defaultValue={bookInfo.targetPages}
                className="w-full px-3 py-0.5 rounded-lg shadow-lg text-lg focus:outline-none"
                />
              <p className="text-myRed text-sm">{errors.newTargetPages?.message}</p>
            </div>
            <div className="space-y-2 text-sm">
              <label htmlFor="newFinishDate">
                新しい目標完了日
              </label>
              <input
                id="newFinishDate" 
                type="text" 
                disabled
                value={newFinishDate.format('YYYY[年]M[月]D[日]')} 
                className="bg-myPaleGray w-full px-3 py-0.5 rounded-lg shadow-lg text-lg focus:outline-none"
                />
              <p className="text-xs">
                ※今日から開始した場合（自動で計算されます）
              </p>
            </div>
            <div className="flex justify-between mx-auto w-11/12">
              <button 
                type="button"
                onClick={onModalClose} 
                className="w-[80px] h-[35px] rounded-lg bg-myMediumBlue text-sm transition hover:bg-hoverBlue focus:ring-1 focus:ring-textGray"
              >
                戻る
              </button>
              <button 
                type="submit" 
                className="w-[80px] h-[35px] rounded-lg bg-myOrange text-sm transition hover:bg-hoverOrange focus:ring-1 focus:ring-textGray"
              >
                決定
              </button>
            </div>
          </form>
        </div>       
      </div>
      <div
        className="fixed top-0 left-0 bg-black/70 w-full h-full z-20"
        onClick={onModalClose}
      ></div>
    </>
  ) : (
    <></>
  );
};

export default UpdateTargetPages;