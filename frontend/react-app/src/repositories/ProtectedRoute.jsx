import { useContext } from "react";
import { SessionContext } from "./SessionProvider";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = () => {
  const { currentUser } = useContext(SessionContext);

  return currentUser ? <Outlet /> : <Navigate replace to="/signin" />
};

export default ProtectedRoute;