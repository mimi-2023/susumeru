import BookItem from "../components/BookItem";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchBooksListRequest } from "../repositories/Requests";


const BooksList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [booksList, setBooksList] = useState([]);
  const navigate = useNavigate();

  const handleNavigate = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  useEffect(() => {
    fetchBooksList();  
  }, []);

  const fetchBooksList = async() => {
    const token = localStorage.getItem("access_token");
    try {
      const result = await fetchBooksListRequest(token);
      setBooksList(result.data);
    } catch (error) {
      // 認証できなければトークンを削除
      localStorage.removeItem("access_token");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>...is Loading</div>
  
  return (
    <div className="space-y-2 md:ml-[300px]">
      {booksList.map((book) => {
        return (
          <div onClick={() => handleNavigate(book.book_id)} key={book.book_id} className="space-y-2 md:flex md:gap-2 md:space-y-0">
          {/*  <Link to={`/books/${book.book_id}`} key={book.book_id} className="space-y-2 md:flex md:gap-2 md:space-y-0"> */}
            <BookItem key={book.book_id} book={book} />
          {/*  </Link> */}
          </div>
          )
      })}
    </div> 
  )
};

export default BooksList;