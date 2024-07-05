import { useState } from 'react';
import UpdateUserName from "../modals/UpdateUserName";
import pencilIcon from "../assets/pencil.svg";

const UserInfo = () => {
  // 仮のレスポンスデータ
  const user = {
    "name": "user1",
    "email": "user1@example.com"
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* モーダル画面 */}
      <UpdateUserName 
          isModalOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          />
      {/* メイン画面 */}
      <div className="bg-white max-w-[360px] min-h-[280px] rounded-2xl shadow-lg">
        <div className="mx-auto pt-5 w-5/6 flex flex-col gap-5">
          <div className="flex justify-between text-myMediumBlue text-xl font-extrabold">
            <h3>ユーザー情報</h3>
            <button 
              type="button" 
              onClick={() => setIsModalOpen(true)}
              className="transition hover:opacity-40"
              >
              <img src={pencilIcon} alt="編集する" />
            </button>          
          </div>
          <div>
            <h4 className="mb-2">ユーザー名</h4>
            <p className="font-normal">{user.name}</p>
          </div>        
          <div>
            <h4 className="mb-2">メールアドレス</h4>
            <p className="font-normal">{user.email}</p>
          </div>
          
        </div>
      </div>
    </>
  )
}

export default UserInfo;