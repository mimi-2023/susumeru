import { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import susumeruLogo from "../assets/susumeru_logo.svg";
import { signupRequest } from "../repositories/Requests";
import { SessionContext } from '../repositories/SessionProvider';

const Signup = () => {
  // 入力フォームのバリデーション
  const signupSchema = z
    .object({
      name: z
        .string()
        .nonempty("ユーザー名は必須です")
        .max(64, "64文字以下で入力して下さい"),
      email: z
        .string()
        .nonempty("メールアドレスは必須です")
        .email("メールドレスの形式が正しくありません")
        .max(64, "64文字以下で入力して下さい"),
      password: z
        .string()
        .nonempty("パスワードは必須です")
        .min(8, "8文字以上で入力して下さい")
        .max(128, "128文字以下で入力して下さい"),
      password2: z
        .string(),
    })
    .refine((data) => data.password === data.password2, {
      message: "パスワードが一致しません",
      path: ["password2"],
    });

  const [requestError, setRequestError] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useContext(SessionContext);
  const { 
    register, handleSubmit, formState: { errors } 
  } = useForm({ mode: "onChange", resolver: zodResolver(signupSchema), });

  // サインアップ処理
  const handleSignup = async(data) => {
    setRequestError("");
    try {
      const response = await signupRequest(data.name, data.email, data.password);
      navigate("/signin");
    } catch (error) {
      if (error.response) {
        // 2xx以外のHTTPステータスがレスポンスで返ってきた場合
        setRequestError("登録に失敗しました");      
      } else {
        // レスポンスがない場合
        setRequestError("通信エラーです");
      }
    }  
  };

  if(currentUser) return <Navigate replace to="/books/list" />;

  return (
    <div className="bg-myPaleBlue text-textBlack font-roundedMplus font-medium min-h-screen">
      <div className="mx-auto pt-5 w-5/6 max-w-xs">
        <img src={susumeruLogo} alt="logo" className="mx-auto my-5" />
        <h1 className="mb-10 text-xl text-center">
          新規登録
        </h1>
        <form onSubmit={handleSubmit(handleSignup)} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">
              ユーザー名
            </label>
            <input 
              {...register("name")}
              id="name" 
              type="text" 
              placeholder="Name" 
              className="px-3 py-0.5 rounded-lg shadow-lg text-lg focus:outline-none"
              />
            <p className="text-myRed text-sm">{errors.name?.message}</p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">
              メールアドレス
            </label>
            <input 
              {...register("email")}
              id="email" 
              type="email" 
              placeholder="Email" 
              className="px-3 py-0.5 rounded-lg shadow-lg text-lg focus:outline-none"
              />
            <p className="text-myRed text-sm">{errors.email?.message}</p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password1">
              パスワード
            </label>
            <input 
              {...register("password")}
              id="password1" 
              type="password" 
              placeholder="Password" 
              className="px-3 py-0.5 rounded-lg shadow-lg text-lg focus:outline-none"
              />
            <p className="text-myRed text-sm">{errors.password?.message}</p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password2">
              パスワード（確認用）
            </label>
            <input 
              {...register("password2")}
              id="password2" 
              type="password" 
              placeholder="Password(confirm)" 
              className="px-3 py-0.5 rounded-lg shadow-lg text-lg focus:outline-none"
              />
            <p className="text-myRed text-sm">{errors.password2?.message}</p>
            {requestError && (<p className="text-myRed text-center">{requestError}</p>)}  
          </div>
          <div className="flex justify-center">
            <button 
              type="submit" 
              className="w-[140px] h-[40px]  mt-6 rounded-lg bg-myOrange transition hover:bg-hoverOrange focus:ring-2 focus:ring-textBlack"
            >
              新規登録
            </button>
          </div>  
        </form>
        <div className="flex justify-center">
          <Link to="/signin" className="mt-6 transition hover:opacity-40">
              ログインはこちら
          </Link>
        </div>
      </div>
    </div>
  )
};

export default Signup;
