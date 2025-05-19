import { useState, useEffect } from "react";
import { fetchFields, timeSlots, makeReservation } from "../../../services/api";
import dayjs from 'dayjs';
import GuestInfo from "../Components/GuestInfo";
import DatePicker from "../Components/DatePicker";
import FieldSelector from "../Components/FieldSelector";
import SlotSelector from "../Components/SlotSelector";



const MakeReservation = () => {
    const [fieldId, setFieldId] = useState("");
    const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [selectedSlot, setSelectedSlot] = useState("");
    const [slots, setSlots] = useState([]);
    const [fields, setFields] = useState([]);
    const [formData, setFormData] = useState({
        guest_name: "",
        guest_phone: ""
    });

    useEffect(()=>{
      const handleFetch = async () => {
        try {
          const response = await fetchFields();
          const data = await response.json();
          setFields(data);
          setFieldId(data[0]?.id || "");
        } catch (error) {
          console.error(error);  
        }
      }

      handleFetch()        
    }, []);

    const fetchTimeSlots = async () => {
        if (!fieldId || !selectedDate) return;

        try {
            const response = await timeSlots(fieldId, selectedDate); 
            const data = await response.json();
            setSlots(data);
            const availableSlot = data.find(slot => !slot.isbooked);
            console.log("available slot", availableSlot);
            setSelectedSlot(availableSlot?.slot_id || "");
        } catch (error) {
            console.error("Failed to fetch time slots", error.message);
        }
      };

    useEffect(() => {
      fetchTimeSlots();
    }, [fieldId, selectedDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            fieldId,
            slotId: selectedSlot,
            date: selectedDate
        };

        try {
            await makeReservation(payload);
            await fetchTimeSlots();
        } catch (error) {
            console.error("Error while trying to make the reservation", error.message);
        }
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    return (
        <form onSubmit={ handleSubmit }>
            <GuestInfo formData={formData} onChange={handleChange} />
            <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
            <FieldSelector fields={fields} value={fieldId} onChange={setFieldId} />
            <SlotSelector slots={slots} value={selectedSlot} onChange={setSelectedSlot} />
            <button type="submit">Book</button>
        </form>
    );
};

export default MakeReservation;