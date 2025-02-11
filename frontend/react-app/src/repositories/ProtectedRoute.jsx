import { useContext } from "react";
import { SessionContext } from "./SessionProvider";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(SessionContext);

  return currentUser ? children : <Navigate replace to="/signin" />
};

export default ProtectedRoute;