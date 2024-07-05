import { useState } from 'react';
import { Link } from "react-router-dom";
import susumeruLogo from "../assets/susumeru_logo.svg";
import hamburgerIcon from "../assets/hamburger.svg";
import bookIcon from "../assets/book.svg";
import plusIcon from "../assets/plus.svg";
import userIcon from "../assets/user.svg";
import logoutIcon from "../assets/logout.svg";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className="flex justify-between relative">
      <div>
        <button 
          type="button" 
          onClick={() => setOpenMenu(!openMenu)} 
          className="mb-16 transition hover:opacity-40 md:invisible"
          >
          <img src={hamburgerIcon} alt="メニュー" />
        </button>
        {/* 背景をグレーアウトするか検討中。しないなら、以下のdivは消す */}
        <div className="">
        <nav className={openMenu 
          ? "bg-myPaleBlue p-8 absolute z-10 top-20 left-0 shadow-lg md:shadow-none" 
          : "hidden bg-myPaleBlue p-8 absolute z-10 top-20 left-0 md:block"}
          >
          <h2 className="mb-8 text-myMediumBlue text-3xl font-extrabold">
            MENU
          </h2>
          <ul className="">
            <li className="mb-6">
              <Link to="" className="flex items-center gap-5 transition hover:opacity-40">
                <img src={bookIcon} alt="本の一覧を表示" />
                <p>本の一覧を表示</p>
              </Link>
            </li>
            <li className="mb-6">
              <Link to="" className="flex items-center gap-5 transition hover:opacity-40">
                <img src={plusIcon} alt="本を登録する" />
                <p>本を登録する</p>
              </Link>
            </li>
            <li className="mb-6">
              <Link to="" className="flex items-center gap-5 transition hover:opacity-40">
                <img src={userIcon} alt="ユーザー情報" />
                <p>ユーザー情報</p>
              </Link>
            </li>
            <li className="mb-6">
              <Link to="" className="flex items-center gap-5 transition hover:opacity-40">
                <img src={logoutIcon} alt="ログアウト" />
                <p>ログアウト</p>
              </Link>
            </li>
          </ul>
        </nav> 
        </div>              
      </div>
      
      <img src={susumeruLogo} alt="logo" className="absolute top-0 right-0"/> 
    </header>
  )
}

export default Header;
