import { useContext } from "react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { toast } from 'react-toastify';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { SessionContext } from '../repositories/SessionProvider';
import { createBookRequest } from "../repositories/Requests";
import { finishDate } from "../repositories/utils";
import plusIcon from "../assets/plus.svg";


// eslint-disable-next-line react/prop-types
const CreateBook = ({ isModalOpen, setIsModalOpen }) => {
  // 入力フォームのバリデーション
  const createBookSchema = z
    .object({
      title: z
        .string()
        .min(1, "ユーザー名は必須です")
        .max(64, "64文字以下で入力して下さい"),
      firstPage: z.coerce
        .number()
        .int("1以上の整数で入力して下さい")
        .gte(1, "1以上の整数で入力して下さい")
        .lte(100000),
      lastPage: z.coerce
        .number()
        .int("1以上の整数で入力して下さい")
        .gte(1, "1以上の整数で入力して下さい")
        .lte(100000),
      targetPages: z.coerce
        .number()
        .int("1以上の整数で入力して下さい")
        .gte(1, "1以上の整数で入力して下さい")
        .lte(100000),
    })
    .refine((data) => data.firstPage <= data.lastPage, {
      message: "終了ページは開始ページより大きい数字を入力して下さい",
      path: ["lastPage"],
    });
  
  const token = localStorage.getItem("access_token");
  const { setCurrentUser } = useContext(SessionContext);
  const { 
      register, watch, handleSubmit, reset, formState: { errors } 
    } = useForm({ mode: "onSubmit", resolver: zodResolver(createBookSchema), });

  // 目標完了日を計算する
  const watchFirstPage = watch("firstPage");
  const watchLastPage = watch("lastPage");
  const watchTargetPages = watch("targetPages");
  const FinishDate = finishDate({
    startDate: dayjs(), 
    startPage: watchFirstPage - 1, 
    lastPage: watchLastPage, 
    targetPages: watchTargetPages,
  });

  // モーダルを閉じる
  const onModalClose = () => {
    reset();
    setIsModalOpen(false);
  };
  
  // 本の新規登録処理
  const handleCreateBook = async(data) => {
    try {     
      const result = await createBookRequest(
        token, 
        data.title, 
        data.firstPage,
        data.lastPage,
        data.targetPages
      );
      localStorage.setItem("toastMessage", "本を新規登録しました");
      window.location.reload();
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
        <div className="mx-auto py-8 w-5/6 space-y-6">
          <div className="flex items-center gap-2 text-myDeepBlue font-extrabold">
            <img src={plusIcon} alt="plus" className="size-6" />
            <p>本を登録する</p>
          </div>
          <form onSubmit={handleSubmit(handleCreateBook)} className="space-y-4">
            <div className="space-y-2 text-sm">
              <label htmlFor="title">
                タイトル
              </label>
              <input
                {...register("title")} 
                id="title" 
                type="text" 
                required
                className="w-full px-3 py-0.5 rounded-lg shadow-lg text-lg focus:outline-none"
                />
              <p className="text-myRed text-sm">{errors.title?.message}</p>
            </div>
            <div className="space-y-2 text-sm">
              <label htmlFor="firstPage">
                本文の開始ページ
              </label>
              <input
                {...register("firstPage")} 
                id="firstPage" 
                type="number" 
                required
                className="w-full px-3 py-0.5 rounded-lg shadow-lg text-lg focus:outline-none"
                />
              <p className="text-myRed text-sm">{errors.firstPage?.message}</p>
            </div>
            <div className="space-y-2 text-sm">
              <label htmlFor="lastPage">
                本文の終了ページ
              </label>
              <input
                {...register("lastPage")} 
                id="lastPage" 
                type="number" 
                required
                className="w-full px-3 py-0.5 rounded-lg shadow-lg text-lg focus:outline-none"
                />
              <p className="text-myRed text-sm">{errors.lastPage?.message}</p>
            </div>
            <div className="space-y-2 text-sm">
              <label htmlFor="targetPages">
                目標ページ数（1日あたり）
              </label>
              <input
                {...register("targetPages")} 
                id="targetPages" 
                type="number" 
                required
                className="w-full px-3 py-0.5 rounded-lg shadow-lg text-lg focus:outline-none"
                />
              <p className="text-myRed text-sm">{errors.targetPages?.message}</p>
            </div>
            <div className="space-y-2 text-sm">
              <label htmlFor="FinishDate">
                目標完了日
              </label>
              <input
                id="FinishDate" 
                type="text" 
                disabled
                value={FinishDate ? FinishDate.format('YYYY[年]M[月]D[日]') : ""} 
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

export default CreateBook;