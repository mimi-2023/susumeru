import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import bookOrangeIcon from "../assets/book_orange.svg";

const ProgressCircle = ({ progressPercent }) => {
  
  return (
    <>
      <CircularProgressbarWithChildren 
        value={progressPercent}
        styles={buildStyles({
          // Colors
          pathColor: "#FFB800",
          trailColor: "#D9D9D9",
        })}
        className="relative"
      >
        <img src={bookOrangeIcon} alt="book" className="absolute" />
        <div className="absolute text-xs font-extrabold">
          {progressPercent}%
        </div>
      </CircularProgressbarWithChildren>
    </>
  )
};

export default ProgressCircle;