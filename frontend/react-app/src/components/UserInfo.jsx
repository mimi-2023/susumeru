import { useContext, useState } from 'react';
import UpdateUsername from "../modals/UpdateUsername";
import pencilIcon from "../assets/pencil.svg";
import { SessionContext } from '../repositories/SessionProvider';

const UserInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useContext(SessionContext);

  return (
    <>
      {/* モーダル画面 */}
      <UpdateUsername 
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          />
      {/* メイン画面 */}
      <div className="bg-white w-full max-w-[360px] min-h-[280px] rounded-2xl shadow-lg">
        <div className="mx-auto py-5 w-5/6 space-y-5">
          <div className="flex justify-between text-myMediumBlue text-xl font-extrabold">
            <h3>ユーザー情報</h3>
            <button 
              type="button" 
              onClick={() => setIsModalOpen(true)}
              className="transition hover:opacity-40"
              >
              <img src={pencilIcon} alt="ユーザー情報を編集する" />
            </button>          
          </div>
          <div className="space-y-2">
            <h4>ユーザー名</h4>
            <p className="font-normal">{currentUser.name}</p>
          </div>        
          <div className="space-y-2">
            <h4>メールアドレス</h4>
            <p className="font-normal">{currentUser.email}</p>
          </div>
          
        </div>
      </div>
    </>
  )
};

export default UserInfo;