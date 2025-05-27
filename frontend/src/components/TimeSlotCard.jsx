import styles from "./styles/TimeSlotCard.module.css"

const TimeSlotCard = ({ timeSlotDetails, onBook }) => {

  return (
    <div className={ styles.timeSlotCard }>
        <h2>{ timeSlotDetails.slot_name }</h2>
        <button 
        onClick={() => onBook(timeSlotDetails)}
        disabled={timeSlotDetails.isbooked}>
        {timeSlotDetails.isbooked ? "Booked" : "Book"}
        </button>
    </div>
  );
};

export default TimeSlotCard;