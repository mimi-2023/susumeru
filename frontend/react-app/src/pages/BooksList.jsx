import Header from "../components/Header";
import BookTitle from "../components/BookTitle";
import BookInfo from "../components/BookInfo";


const BooksList = () => {
  return (
    <div className="bg-myPaleBlue text-textBlack font-roundedMplus font-medium min-h-screen">
      <div className="mx-auto pt-5 w-11/12">
        <Header />
        {/* 本の情報表示ではgridレイアウト使うので、以下のdivはそれに合わせてあとで調整する */}
        <div className="md:ml-[300px]">
          <div className="space-y-2 md:flex md:space-x-2 md:space-y-0">
            <BookTitle />
            <BookInfo />
          </div>
        </div>        
      </div>
    </div>
  )
};

export default BooksList;