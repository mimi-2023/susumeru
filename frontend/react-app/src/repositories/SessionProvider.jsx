import { createContext, useEffect, useState } from "react";
import { fetchUserRequest } from "./Requests";

const SessionContext = createContext();

const SessionProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSession();
  }, []);

  const setSession = async () => {
    const token = localStorage.getItem("access_token");
    // トークンがなければcurrentUserが空のままreturn→signinへ遷移する
    if (!token) {
      setIsLoading(false);
      return;
    }
    // トークンがあればuser情報をリクエスト→認証できればcurrentUserをセット
    try {
      const result = await fetchUserRequest(token);
      setCurrentUser(result.data);
    } catch (error) {
      // 認証できなければcurrentUserは空のまま、トークンを削除
      localStorage.removeItem("access_token");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>...is Loading</div>

  // currentUserを子要素で参照可能にする
  // 子要素側はcurrentUserが空であれば、ProtectedRouteによりsigninへ遷移する
  return (
    <SessionContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };