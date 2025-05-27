import { useState, useEffect } from "react";
import { fetchFields, timeSlots } from "../../../services/api";
import dayjs from "dayjs";

const useFieldAndDateManager = () => {
  const [fieldId, setFieldId] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedSlot, setSelectedSlot] = useState("");
  const [slots, setSlots] = useState([]);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const response = await fetchFields();
        const data = await response.json();
        setFields(data);
        setFieldId(data[0]?.id || "");
      } catch (error) {
        console.error(error);
      }
    };

    handleFetch();
  }, []);

  const fetchTimeSlots = async (date = selectedDate) => {
    if (!fieldId || !date) return;

    try {
      const response = await timeSlots(fieldId, date);
      const data = await response.json();
      setSlots(data);
      const availableSlot = data.find((slot) => !slot.isbooked);
      setSelectedSlot(availableSlot?.slot_id || "");
    } catch (error) {
      console.error("Failed to fetch time slots", error.message);
    }
  };

  useEffect(() => {
    fetchTimeSlots();
  }, [fieldId, selectedDate]);

  return {
    fieldId,
    setFieldId,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    fields,
    slots,
    fetchTimeSlots
  };
};

export default useFieldAndDateManager;
