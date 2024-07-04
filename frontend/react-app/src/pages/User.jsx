// import { Link } from "react-router-dom";
import Header from "../components/Header";
import UserInfo from "../components/UserInfo";

const User = () => {
  return (
    <div className="bg-myPaleBlue text-textBlack font-roundedMplus font-medium min-h-screen">
      <div className="mx-auto pt-5 w-11/12">
        <Header />
        <UserInfo />
      </div>
    </div>
  )
}

export default User;
