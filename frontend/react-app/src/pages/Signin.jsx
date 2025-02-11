import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import susumeruLogo from "../assets/susumeru_logo.svg";
import { getUserRequest, signinRequest } from "../repositories/Requests";
import { SessionContext } from "../repositories/SessionProvider";

const Signin = () => {
  // 入力フォームのバリデーション
  const signinSchema = z.object({
    email: z
      .string()
      .nonempty("メールアドレスは必須です")
      .email("メールドレスの形式が正しくありません")
      .max(64, "64文字以下で入力して下さい"),
    password: z
      .string()
      .nonempty("パスワードは必須です")
      .max(128, "128文字以下で入力して下さい"),
  });

  const [requestError, setRequestError] = useState("");
  const { currentUser, setCurrentUser } = useContext(SessionContext);
  const { 
    register, handleSubmit, formState: { errors } 
  } = useForm({ mode: "onChange", resolver: zodResolver(signinSchema), });

  // サインイン処理
  const handleSignin = async(data) => {
    setRequestError("");
    try {
      const signinResponse = await signinRequest(data.email, data.password);
      // JWTをlocalstrageに保存
      const token = signinResponse.data.access_token;
      localStorage.setItem("access_token", token);
      // ユーザー情報を取得しstateに保存
      const userResponse = await getUserRequest(token);
      setCurrentUser(userResponse.data);

    } catch (error) {
      if (error.response) {
        // 2xx以外のHTTPステータスがレスポンスで返ってきた場合
        setRequestError("ログインに失敗しました");      
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
          ログイン
        </h1>
        <form onSubmit={handleSubmit(handleSignin)} className="space-y-10">
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
            <label htmlFor="password">
              パスワード
            </label>
            <input
              {...register("password")}
              id="password" 
              type="password" 
              placeholder="Password" 
              className="px-3 py-0.5 rounded-lg shadow-lg text-lg focus:outline-none"
              />
            <p className="text-myRed text-sm">{errors.password?.message}</p>
            {requestError && (<p className="text-myRed text-center">{requestError}</p>)}
          </div>
          <div className="flex justify-center">
            <button 
              type="submit" 
              className="w-[140px] h-[40px] rounded-lg bg-myOrange transition hover:bg-hoverOrange focus:ring-2 focus:ring-textBlack"
              >
              ログイン
            </button>
          </div>  
        </form>
        <div className="flex justify-center">
          <Link to="/signup" className="mt-10 transition hover:opacity-40">
              新規登録はこちら
          </Link>
        </div>
      </div>
    </div>
  )
};

export default Signin;
