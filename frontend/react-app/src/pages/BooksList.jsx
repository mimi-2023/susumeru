import Header from "../components/Header";
import BookItem from "../components/BookItem";
import { useState, useEffect } from "react";
import { fetchBooksListRequest } from "../repositories/Requests";


const BooksList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [booksList, setBooksList] = useState([]);

  useEffect(() => {
    fetchBooksList();  
  }, []);

  const fetchBooksList = async() => {
    const token = localStorage.getItem("access_token");
    try {
      const result = await fetchBooksListRequest(token);
      setBooksList(result.data);
      // console.log(result.data);
    } catch (error) {
      // 認証できなければトークンを削除
      localStorage.removeItem("access_token");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>...is Loading</div>
  
  return (
    <div className="bg-myPaleBlue text-textBlack font-roundedMplus font-medium min-h-screen">
      <div className="mx-auto pt-5 w-11/12">
        <Header />
        <div className="space-y-2 md:ml-[300px]">
          {booksList.map((book) => {
            return (
              <div key={book.book_id} className="space-y-2 md:flex md:gap-2 md:space-y-0">
                <BookItem book={book} />
              </div>
              )
          })}
        </div>        
      </div>
    </div>
  )
};

export default BooksList;