import { Link } from "react-router-dom";
import susumeruLogo from "../assets/susumeru_logo.svg";

const Signin = () => {
  return (
    <div className="bg-myPaleBlue text-textBlack font-roundedMplus font-medium min-h-screen">
      <div className="mx-auto pt-5 w-5/6 max-w-xs">
        <img src={susumeruLogo} alt="logo" className="mx-auto my-5" />
        <h1 className="mb-10 text-xl text-center">
          ログイン
        </h1>
        <form action="" className="space-y-10">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">
              メールアドレス
            </label>
            <input id="email" type="text" placeholder="  Email" className="rounded-lg shadow-lg text-lg focus:outline-none"/>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">
              パスワード
            </label>
            <input id="password" type="password" placeholder="  Password" className="rounded-lg shadow-lg text-lg focus:outline-none"/>
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
}

export default Signin;
