import { Link } from "react-router-dom";
import susumeruLogo from "../assets/susumeru_logo.svg";

const Signup = () => {
  return (
    <div className="bg-myPaleBlue text-textBlack font-roundedMplus font-medium min-h-screen">
      <div className="mx-auto pt-5 w-5/6 max-w-xs">
        <img src={susumeruLogo} alt="logo" className="mx-auto my-5" />
        <h1 className="mb-10 text-xl text-center">
          新規登録
        </h1>
        <form action="" className="space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">
              ユーザー名
            </label>
            <input id="name" type="text" placeholder="  Name" className="rounded-lg shadow-lg text-lg focus:outline-none"/>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">
              メールアドレス
            </label>
            <input id="email" type="text" placeholder="  Email" className="rounded-lg shadow-lg text-lg focus:outline-none"/>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password1">
              パスワード
            </label>
            <input id="password1" type="password" placeholder="  Password" className="rounded-lg shadow-lg text-lg focus:outline-none"/>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password2">
              パスワード（確認用）
            </label>
            <input id="password2" type="password" placeholder="  Password(confirm)" className="rounded-lg shadow-lg text-lg focus:outline-none"/>
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
}

export default Signup;
