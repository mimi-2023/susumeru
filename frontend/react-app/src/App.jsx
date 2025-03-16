import {
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from "react-router-dom";
import { useEffect } from "react";
import { toast, Slide, ToastContainer } from "react-toastify";
import { SessionProvider } from './repositories/SessionProvider.jsx';
import ProtectedRoute from "./repositories/ProtectedRoute";
import Base from "./pages/Base";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import User from "./pages/User";
import BooksList from "./pages/BooksList";
import Book from "./pages/Book";
// import './App.css'


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      {/* 以下はProtectedRoute で保護 */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Base />}>
          <Route path="/user" element={<User />} />
          <Route path="/books" element={<BooksList />} />
          <Route path="/books/:bookId" element={<Book />} />
        </Route>               
      </Route>      
    </>
  )
)

function App() {
  // 再読込後にトーストメッセージがある場合は表示する
  // 注意：開発環境ではStrictModeをoffにしないと表示されない（useEffectが2回実行されるため）
  useEffect(() => {
    const message = localStorage.getItem("toastMessage");
    if (message) {
      toast.success(message);
      localStorage.removeItem("toastMessage"); // 一度表示したら削除
    }
  }, []);

  return (
    <SessionProvider>
      <RouterProvider router={router} />
      <ToastContainer
          position="top-center"
          autoClose={3500}
          hideProgressBar
          transition={Slide}
      />
    </SessionProvider>  
  );
}

export default App
