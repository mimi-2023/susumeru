import { createContext, useEffect, useState } from "react";
import { getUserRequest } from "./Requests";

const SessionContext = createContext();

const SessionProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSession();
  }, []);

  const setSession = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await getUserRequest(token);
      setCurrentUser(response.data);
    } catch (error) {
      localStorage.removeItem("access_token");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>...is Loading</div>

  return (
    <SessionContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };