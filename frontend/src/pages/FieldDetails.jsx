import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css"; 
import { RiCalendarLine } from "react-icons/ri";
import { timeSlots } from "../services/api";

const FieldDetails = () => {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { field } = location.state || {};
  const [timeSlotsAvailability, setTimeSlotsAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    fetchTimeSlots(fieldId, date.toISOString().split('T')[0]);
  };

  const toggleCalendar = () =>{
    setShowCalendar((prevState) => !prevState);
  };

  const fetchTimeSlots = async (fieldId, date) => {
    const dateToUse = (typeof date === "string") ? date : date.toISOString().split('T')[0];
    try {
      const response = await timeSlots(fieldId, dateToUse);
      const data = await response.json();
      setTimeSlotsAvailability(data);
    } catch (error) {
      console.error(error.message);
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
          timeSlotsAvailability.map((slot, index) => (
            <li key={index}>
                {slot.slot_name} - {slot.isbooked ? "Booked" : "Available"}
            </li>
          ))
        ) : (
          <li>No available slots for this date</li>
        )}
      </ul>

      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default FieldDetails;

