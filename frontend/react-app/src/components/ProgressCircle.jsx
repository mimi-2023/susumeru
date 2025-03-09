import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import bookOrangeIcon from "../assets/book_orange.svg";
import bookGreenIcon from "../assets/book_green.svg";

const ProgressCircle = ({ progressPercent }) => {
  
  return (
    <>
      <CircularProgressbarWithChildren 
        value={progressPercent}
        styles={buildStyles({
          // Colors
          pathColor: progressPercent===100 ? "#4ECB71" : "#FFB800",
          trailColor: "#D9D9D9",
        })}
        className="relative"
      >
        <img src={progressPercent===100 ? bookGreenIcon : bookOrangeIcon} alt="book" className="absolute" />
        <div className="absolute text-xs font-extrabold">
          {progressPercent}%
        </div>
      </CircularProgressbarWithChildren>
    </>
  )
};

export default ProgressCircle;