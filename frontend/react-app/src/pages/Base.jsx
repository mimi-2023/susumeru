import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Base = () => {
  return (
    <div className="bg-myPaleBlue text-textBlack font-roundedMplus font-medium min-h-screen">
      <div className="mx-auto pt-5 w-11/12">
        <Header />
        <Outlet />        
      </div>
    </div>
  )
};

export default Base;
