import {
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import User from "./pages/User";
import BooksList from "./pages/BooksList";
// import './App.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/user" element={<User />} />
      <Route path="/books/list" element={<BooksList />} />
    </>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App
