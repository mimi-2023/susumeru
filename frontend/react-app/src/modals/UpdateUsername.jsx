import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import pencilIcon from "../assets/pencil.svg";
import { SessionContext } from '../repositories/SessionProvider';
import { updateUsernameRequest } from "../repositories/Requests";


// eslint-disable-next-line react/prop-types
const UpdateUserName = ({ isModalOpen, setIsModalOpen }) => {
  // 入力フォームのバリデーション
  const UpdateUsernameSchema = z
    .object({
      newname: z
        .string()
        .min(1, "ユーザー名は必須です")
        .max(64, "64文字以下で入力して下さい"),
    });
  
  const token = localStorage.getItem("access_token");
  const { setCurrentUser } = useContext(SessionContext);
  const { 
      register, handleSubmit, reset, formState: { errors } 
    } = useForm({ mode: "onChange", resolver: zodResolver(UpdateUsernameSchema), });

  // モーダルを閉じる
  const onModalClose = () => {
    reset();
    setIsModalOpen(false);
  };
  
  // ユーザー名の変更処理
  const handleUpdateUsername = async(data) => {
    try {     
      const result = await updateUsernameRequest(token, data.newname);
      setCurrentUser(result.data);
      toast.success("ユーザー名を変更しました");
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
      <div className="bg-myPaleBlue absolute z-20 w-[340px] min-h-[260px] rounded-2xl shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="mx-auto py-8 w-5/6 space-y-8">
          <div className="flex items-center gap-2 text-myDeepBlue font-extrabold">
            <img src={pencilIcon} alt="pencil" className="size-6" />
            <p>ユーザー名を変更する</p>
          </div>
          <form onSubmit={handleSubmit(handleUpdateUsername)} className="space-y-12">
            <div className="space-y-2 text-sm">
              <label htmlFor="newname">
                新しいユーザー名
              </label>
              <input
                {...register("newname")} 
                id="newname" 
                type="text" 
                required
                placeholder="New Name" 
                className="w-full px-3 py-0.5 rounded-lg shadow-lg text-lg focus:outline-none"
                />
              <p className="text-myRed text-sm">{errors.newname?.message}</p>
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
        className="fixed top-0 left-0 bg-black/70 w-full h-full z-10"
        onClick={onModalClose}
      ></div>
    </>
  ) : (
    <></>
  );
};

export default UpdateUserName;