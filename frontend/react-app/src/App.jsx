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
import ProtectedRoute from "./repositories/ProtectedRoute";
// import './App.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      {/* ProtectedRoute で保護 */}
      <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
      <Route path="/books/list" element={<ProtectedRoute><BooksList /></ProtectedRoute>} />
    </>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App
