import styles from "./styles/TimeSlotCard.module.css"
import dayjs from "dayjs";

const TimeSlotCard = ({ timeSlotDetails, onBook, selectedDate }) => {
  const formattedDate = dayjs(selectedDate);

  const isToday = formattedDate.isSame(dayjs(), "day");

  const hasSlotStarted = () => {
    const now = dayjs();
    const startTimeStr = timeSlotDetails.slot_name.split(" - ")[0];
    const parsedStart = dayjs(startTimeStr, "h:mm A");

    const slotStartTime = formattedDate
      .hour(parsedStart.hour())
      .minute(parsedStart.minute())
      .second(0);

    return now.isAfter(slotStartTime);
  };

  const isDisabled = timeSlotDetails.isbooked || (isToday && hasSlotStarted());

  return (
    <div className={ styles.timeSlotCard }>
        <h2>{ timeSlotDetails.slot_name }</h2>
        <button 
        onClick={() => onBook(timeSlotDetails)}
        disabled={isDisabled}>
        {isDisabled ? "Unavailable" : "Book"}
        </button>
    </div>
  );
};

export default TimeSlotCard;