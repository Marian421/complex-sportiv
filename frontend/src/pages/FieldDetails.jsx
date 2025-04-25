import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css"; 
import { RiCalendarLine } from "react-icons/ri";
import { bookField, timeSlots } from "../services/api";
import TimeSlotCard from "../components/TimeSlotCard";
import Modal from "react-modal";
import { useAuth } from "../contexts/AuthContext";


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
    fetchTimeSlots(fieldId, date.toISOString().split('T')[0]);
  };

  const toggleCalendar = () =>{
    setShowCalendar((prevState) => !prevState);
  };

  const fetchTimeSlots = async (fieldId, date) => {
    console.log(">>> FETCHING SLOTS FOR FIELD:", fieldId);
    console.log(">>> RAW selectedDate:", date);
    console.log(">>> TO STRING:", typeof date === "string" ? date : date.toISOString());
    const dateToUse = (typeof date === "string")
      ? date
      : date.toLocaleDateString("en-CA");
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
    const dateToUse = selectedDate.toISOString().split('T')[0];
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
    fetchTimeSlots(fieldId, selectedDate);
  }, [fieldId, selectedDate]);

  if (!field) return <p>Missing field details</p>;

  return (
    <div>
      <h2>{field.name}</h2>
      <p>{field.description}</p>
      <p>Location: {field.location}</p>
      <p>Price: ${field.price_per_hour}/hr</p>
      <img
        src={`http://localhost:5000${field.image_path}`}
        alt={field.name}
        width="400"
      />
      <button onClick={toggleCalendar} style={{ fontSize: "24px", border: "none", background: "none", cursor: "pointer" }}>
        <RiCalendarLine />
      </button>

      {showCalendar && (
          <div style={{ position: "absolute", zIndex: 10 }}>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              maxDetail="month"
              minDate={new Date()} 
            />
          </div>
      )}

      <h3>Available Time Slots for {selectedDate.toDateString()}:</h3>

      <ul>
        {timeSlotsAvailability && timeSlotsAvailability.length > 0 ? (
          timeSlotsAvailability.map((slot) => (
            <TimeSlotCard key={slot.slot_id} timeSlotDetails={slot} onBook={openModal}/>
          ))
        ) : (
          <li>No available slots for this date</li>
        )}
      </ul>

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
            <h2 style={{color: "black"}}>Confirm Booking</h2>
            {selectedSlot && (
            <p>
                Book <strong>{selectedSlot.slot_name}</strong> on{" "}
                {selectedDate.toDateString()}?
            </p>
            )}
            <button onClick={handleBooking}>Yes, Book it!</button>
            <button onClick={closeModal} style={{ marginLeft: "10px" }}>
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

