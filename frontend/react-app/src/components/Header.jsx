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
  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <header className="flex justify-between relative">
      <div>
        <button type="button" onClick={handleOpenMenu} className="mb-16 transition hover:opacity-40 md:invisible">
          <img src={hamburgerIcon} alt="hamburger menu" />
        </button>
        <div className="">
        <nav className={openMenu 
          ? "bg-myPaleBlue p-8 absolute z-10 top-20 left-0" 
          : "hidden bg-myPaleBlue p-8 absolute z-10 top-20 left-0 md:block"}
          >
          <h2 className="mb-8 text-myMediumBlue text-3xl font-extrabold">
            MENU
          </h2>
          <ul className="">
            <li className="mb-6">
              <Link to="" className="flex items-center gap-5 transition hover:opacity-40">
                <img src={bookIcon} alt="books list" />
                本の一覧を表示
              </Link>
            </li>
            <li className="mb-6">
              <Link to="" className="flex items-center gap-5 transition hover:opacity-40">
                <img src={plusIcon} alt="register book" />
                本を登録する
              </Link>
            </li>
            <li className="mb-6">
              <Link to="" className="flex items-center gap-5 transition hover:opacity-40">
                <img src={userIcon} alt="register book" />
                ユーザー情報
              </Link>
            </li>
            <li className="mb-6">
              <Link to="" className="flex items-center gap-5 transition hover:opacity-40">
                <img src={logoutIcon} alt="register book" />
                ログアウト
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
