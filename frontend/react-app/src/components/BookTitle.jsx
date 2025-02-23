import ProgressPercent from "./ProgressPercent";


const BookTitle = () => {

  return (
    <>
      <div className="bg-white w-full max-w-[360px] min-h-[100px] rounded-2xl shadow-lg">
        <div className="flex items-center mx-auto min-h-[100px] w-5/6">
          <div className="flex items-center space-x-6 text-xl">
            <div className="size-[63px] flex-shrink-0">
              <ProgressPercent />
            </div>
            <p>基本情報技術者教室</p>          
          </div>     
        </div>
      </div>
    </>
  )
};

export default BookTitle;