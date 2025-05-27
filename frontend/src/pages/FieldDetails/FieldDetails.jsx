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
    console.log(">>> FETCHING SLOTS FOR FIELD:", fieldId);
    console.log(">>> RAW selectedDate:", date);
    console.log(">>> TO STRING:", typeof date === "string" ? date : date.toISOString());
    const dateToUse = dayjs(date).format('YYYY/MM/DD');
    console.log("date to use inside fetchTimeSlots", dateToUse);
    try {
      const response = await timeSlots(fieldId, dateToUse);
      const data = await response.json();
      console.log(">>> SERVER RESPONSE:", data);
      setTimeSlotsAvailability(data);
      console.log('state after update', timeSlotsAvailability);
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
      <h2>{field.name}</h2>
      <p>{field.description}</p>
      <p>Location: {field.location}</p>
      <p>Price: ${field.price_per_hour}/hr</p>
      <img
        src={`http://localhost:5000${field.image_path}`}
        alt={field.name}
        width="400"
      />
      <button onClick={toggleCalendar}>
        <RiCalendarLine />
      </button>

      {showCalendar && (
          <div>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              maxDetail="month"
              minDate={new Date()} 
            />
          </div>
      )}

      <h3>Available Time Slots for {dayjs(selectedDate).format("dddd, MMMM D, YYYY")}:</h3>

      <div className={ styles.timeslotsContainer}>
        {timeSlotsAvailability && timeSlotsAvailability.length > 0 ? (
          timeSlotsAvailability.map((slot) => (
            <TimeSlotCard key={slot.slot_id} timeSlotDetails={slot} onBook={openModal}/>
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
            content: {
                maxWidth: "400px",
                margin: "auto",
                padding: "20px",
                borderRadius: "12px",
                height:"500px",
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
            <button onClick={handleBooking}>Yes, Book it!</button>
            <button onClick={closeModal}>
            Cancel
            </button>
            {loading && <p style={{color: "black"}}>Loading...</p>}
      </Modal>

      <Modal isOpen={showLoginPrompt} onRequestClose={() => setShowLoginPrompt(false)}>
        <h2 style={{color: "black"}}>Please log in to continue</h2>
        <p>You need to be signed in to book a time slot.</p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button onClick={() => navigate("/login")}>Log In</button>
            <button onClick={() => navigate("/register")}>Register</button>
            <button onClick={() => setShowLoginPrompt(false)}>Cancel</button>
        </div>
      </Modal>


      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default FieldDetails;

