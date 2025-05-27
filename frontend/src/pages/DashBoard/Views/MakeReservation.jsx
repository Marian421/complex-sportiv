import { useState } from "react";
import { makeReservation } from "../../../services/api";
import GuestInfo from "../Components/GuestInfo";
import DatePicker from "../Components/DatePicker";
import FieldSelector from "../Components/FieldSelector";
import SlotSelector from "../Components/SlotSelector";
import useFieldAndDateManager from "../hooks/useFieldAndDateManager";

const MakeReservation = () => {
    const {
      fieldId,
      setFieldId,
      selectedDate,
      setSelectedDate,
      selectedSlot,
      setSelectedSlot,
      fields,
      slots,
      fetchTimeSlots
    } = useFieldAndDateManager();

    const [formData, setFormData] = useState({
        guest_name: "",
        guest_phone: ""
    });

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