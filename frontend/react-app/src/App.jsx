import {
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from "react-router-dom";
import Login from "./pages/Login";
// import './App.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Login />} />
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App
