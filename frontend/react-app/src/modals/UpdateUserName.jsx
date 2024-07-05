import pencilIcon from "../assets/pencil.svg";

// eslint-disable-next-line react/prop-types
const UpdateUserName = ({ isModalOpen, onClose }) => {
  return isModalOpen ? (
    <>
      <div className="bg-myPaleBlue absolute z-20 min-w-[340px] min-h-[260px] rounded-2xl shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="mx-auto pt-5 w-5/6 flex flex-col gap-8">
          <div className="flex items-center gap-2 text-myDeepBlue font-extrabold">
            <img src={pencilIcon} alt="pencil" className="size-6" />
            <p>ユーザー名を変更する</p>
          </div>
          <form action="">
            <div className="flex flex-col gap-2">
              <label htmlFor="newname">
                新しいユーザー名
              </label>
              <input id="newname" type="text" placeholder="  New Name" className="rounded-lg shadow-lg text-lg focus:outline-none"/>
            </div>
            <div className="flex justify-between mt-12 mx-auto w-11/12">
              <button 
                type="button"
                onClick={onClose} 
                className="w-[80px] h-[35px] rounded-lg bg-myMediumBlue transition hover:bg-hoverBlue focus:ring-1 focus:ring-textGray"
              >
                戻る
              </button>
              <button 
                type="submit" 
                className="w-[80px] h-[35px] rounded-lg bg-myOrange transition hover:bg-hoverOrange focus:ring-1 focus:ring-textGray"
              >
                決定
              </button>
            </div>
          </form>
        </div>       
      </div>
      <div
        className="fixed top-0 left-0 bg-black/70 w-full h-full z-10"
        onClick={onClose}
      ></div>
    </>
  ) : (
    <></>
  );
};

export default UpdateUserName;