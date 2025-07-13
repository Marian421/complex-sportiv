import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css"; 
import { RiCalendarLine } from "react-icons/ri";
import { bookField, timeSlots } from "../../services/api";
import TimeSlotCard from "../../components/TimeSlotCard";
import Modal from "react-modal";
import { useAuth } from "../../contexts/AuthContext";
import dayjs from "dayjs";
import styles from "./FieldDetails.module.css"
import Navbar from "../../components/Navbar"

const FieldDetails = () => {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { field } = location.state || {};
  const [timeSlotsAvailability, setTimeSlotsAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const openModal = (slot) => {
    if (!user) {
        setShowLoginPrompt(true);
        return;
    }
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const toggleCalendar = () =>{
    setShowCalendar((prevState) => !prevState);
  };

  const fetchTimeSlots = async (fieldId, date) => {
    const dateToUse = dayjs(date).format('YYYY/MM/DD');
    try {
      const response = await timeSlots(fieldId, dateToUse);
      const data = await response.json();
      setTimeSlotsAvailability(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleBooking = async () => {
    const dateToUse = dayjs(selectedDate).format('YYYY/MM/DD');
    try {
      setLoading(true);
      await bookField(fieldId, selectedSlot.slot_id, dateToUse);
      const updatedSlots = await timeSlots(fieldId, dateToUse);
      const data = await updatedSlots.json();
      setTimeSlotsAvailability(data);
      closeModal();
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
    fetchTimeSlots(fieldId, formattedDate);
  }, [fieldId, selectedDate]);

  if (!field) return <p>Missing field details</p>;

  return (
    <div className={ styles.fieldDetails }>
      <Navbar option="fieldDetails"/>
      <h2>{field.name}</h2>
      <p>{field.description}</p>
      <p>Location: {field.location}</p>
      <p>Price: {field.price_per_hour} lei/ora</p>
      <img
        src={`http://localhost:5000${field.image_path}`}
        alt={field.name}
        width="400"
      />

      <div className={ styles.flexRow }>
        <h3>Available Time Slots for {dayjs(selectedDate).format("dddd, MMMM D, YYYY")}:</h3>
        <button className={ styles.calendarButton } onClick={toggleCalendar}>
          <RiCalendarLine />
        </button>
      </div>

      {showCalendar && (
          <div className={styles.calendarWrapper}>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              maxDetail="month"
              minDate={new Date()} 
              maxDate={dayjs().add(7, 'day').toDate()}
            />
          </div>
      )}

      <div className={ styles.timeslotsContainer}>
        {timeSlotsAvailability && timeSlotsAvailability.length > 0 ? (
          timeSlotsAvailability.map((slot) => (
            <TimeSlotCard key={slot.slot_id} timeSlotDetails={slot} onBook={openModal} selectedDate={selectedDate}/>
          ))
        ) : (
          <div>No available slots for this date</div>
        )}
      </div>

        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Confirm Booking"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              content: {
                position: "static",
                inset: "unset",
                maxWidth: "400px",
                width: "90%", 
                margin: "auto",
                padding: "20px",
                borderRadius: "12px",
                border: "none",
                textAlign: "center",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              },
            }}
            >
            <h2>Confirm Booking</h2>
            {selectedSlot && (
            <p>
                Book <strong>{selectedSlot.slot_name}</strong> on{" "}
                {selectedDate.toDateString()}?
            </p>
            )}
            <button className={ styles.modalButtons } onClick={handleBooking}>Yes, Book it!</button>
            <button className={ styles.cancel } onClick={closeModal}>
            Cancel
            </button>
            {loading && <p style={{color: "black"}}>Loading...</p>}
      </Modal>

      <Modal 
      isOpen={showLoginPrompt} 
      onRequestClose={() => setShowLoginPrompt(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          maxWidth: "400px",
          width: "100%",
          postition: "static",
          inset: "unset",
          maxHeight: "500px",
          margin: "auto",
          padding: "2rem",
          borderRadius: "12px",
          textAlign: "center",
          border: "none",
        },
      }}>
        <h2 style={{color: "black"}}>Please log in to continue</h2>
        <p>You need to be signed in to book a time slot.</p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button onClick={() => navigate("/login")}>Log In</button>
            <button onClick={() => navigate("/register")}>Register</button>
            <button className={ styles.cancel } onClick={() => setShowLoginPrompt(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default FieldDetails;

