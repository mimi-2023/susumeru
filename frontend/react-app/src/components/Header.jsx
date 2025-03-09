import { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import susumeruLogo from "../assets/susumeru_logo.svg";
import hamburgerIcon from "../assets/hamburger.svg";
import bookIcon from "../assets/book.svg";
import plusIcon from "../assets/plus.svg";
import userIcon from "../assets/user.svg";
import logoutIcon from "../assets/logout.svg";
import { SessionContext } from '../repositories/SessionProvider';
import CreateBook from "../modals/CreateBook";


const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setCurrentUser } = useContext(SessionContext);

  // サインアウト
  const signout = () => {
    localStorage.removeItem("access_token");
    setCurrentUser(null);
  };

  return (
    <>
      {/* モーダル画面 */}
      <CreateBook 
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          />
      {/* メイン画面 */}
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
          <nav 
            className={`bg-myPaleBlue p-8 absolute z-10 top-20 left-0 space-y-8 shadow-lg md:shadow-none md:block 
            ${openMenu ? "block" : "hidden"}`}
          >
            <h2 className="text-myMediumBlue text-3xl font-extrabold">
              MENU
            </h2>
            <ul className="space-y-6">
              <li>
                <Link to="/books/list" className="flex items-center gap-5 transition hover:opacity-40">
                  <img src={bookIcon} alt="本の一覧を表示" />
                  <p>本の一覧を表示</p>
                </Link>
              </li>
              <li>
                <button
                  type="button" 
                  onClick={() => setIsModalOpen(true)} 
                  className="flex items-center gap-5 transition hover:opacity-40"
                  >
                  <img src={plusIcon} alt="本を登録する" />
                  <p>本を登録する</p>
                </button>
              </li>
              <li>
                <Link to="/user" className="flex items-center gap-5 transition hover:opacity-40">
                  <img src={userIcon} alt="ユーザー情報" />
                  <p>ユーザー情報</p>
                </Link>
              </li>
              <li>
                <button onClick={signout} className="flex items-center gap-5 transition hover:opacity-40">
                  <img src={logoutIcon} alt="ログアウト" />
                  <p>ログアウト</p>
                </button>
              </li>
            </ul>
          </nav> 
          </div>              
        </div>
        
        <img src={susumeruLogo} alt="logo" className="absolute top-0 right-0"/> 
      </header>
    </>
  )
};

export default Header;
