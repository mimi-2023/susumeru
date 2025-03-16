// import BookItem from "../components/BookItem";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchBooksListRequest } from "../repositories/Requests";


const Book = () => {
  // const [isLoading, setIsLoading] = useState(true);
  // const [booksList, setBooksList] = useState([]);
  const { bookId } = useParams();

  // useEffect(() => {
  //   fetchBooksList();  
  // }, []);

  // const fetchBooksList = async() => {
  //   const token = localStorage.getItem("access_token");
  //   try {
  //     const result = await fetchBooksListRequest(token);
  //     setBooksList(result.data);
  //   } catch (error) {
  //     // 認証できなければトークンを削除
  //     localStorage.removeItem("access_token");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // if (isLoading) return <div>...is Loading</div>
  
  return (
    <div className="space-y-2 md:ml-[300px]">
      book ID {bookId}
    </div>
  )
};

export default Book;