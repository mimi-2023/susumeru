import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import book_orange from "../assets/book_orange.svg";

const ProgressPercent = () => {
  // 仮の進捗率
  const progress = 80;

  return (
    <>
      <CircularProgressbarWithChildren 
        value={progress}
        styles={buildStyles({
          // Colors
          pathColor: "#FFB800",
          trailColor: "#D9D9D9",
        })}
        className="relative"
      >
        <img src={book_orange} alt="book" className="absolute" />
        <div className="absolute text-xs font-extrabold">
          {progress}%
        </div>
      </CircularProgressbarWithChildren>
    </>
  )
};

export default ProgressPercent;