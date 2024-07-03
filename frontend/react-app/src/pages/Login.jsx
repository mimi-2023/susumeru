import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="bg-myPaleBlue text-textBlack font-roundedMplus font-medium min-h-screen">
      <div className="mx-auto pt-20 w-5/6 max-w-xs">
        <h1 className="mb-10 text-xl text-center font-semibold">
          ログイン
        </h1>
        <form action="" className="space-y-10">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">
              メールアドレス
            </label>
            <input id="email" type="text" placeholder="  Email" className="rounded-lg shadow-lg text-lg"/>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">
              パスワード
            </label>
            <input id="password" type="password" placeholder="  Password" className="rounded-lg shadow-lg text-lg"/>
          </div>
          <div className="flex justify-center">
            <button 
              type="submit" 
              className="w-[140px] h-[40px] font-semibold rounded-lg bg-myOrange hover:bg-hoverOrange focus:ring-2 focus:ring-textBlack"
              >
              ログイン
            </button>
          </div>  
        </form>
        <div className="flex justify-center mt-10">
          <Link className="hover:text-textGray">
              新規登録はこちら
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login;
