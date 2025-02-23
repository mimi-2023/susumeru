import ProgressPercent from "./ProgressPercent";


const BookTitle = () => {

  return (
    <>
      <div className="bg-white max-w-[360px] min-h-[100px] rounded-2xl shadow-lg">
        <div className="mx-auto py-5 w-5/6">
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