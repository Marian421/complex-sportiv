import { useEffect, useState } from "react";
import DatePicker from "../Components/DatePicker";
import FieldSelector from "../Components/FieldSelector";
import useFieldAndDateManager from "../hooks/useFieldAndDateManager";
import { seeReservations } from "../../../services/api";
import ReservationCard from "../Components/ReservationCard";

const SeeReservations = () => {

    const [slots, setSlots] = useState([]);

    const {
        selectedDate,
        setSelectedDate,
        fields,
        fieldId,
        setFieldId
    } = useFieldAndDateManager();

    useEffect(() => {
        if (fieldId === "" || selectedDate === "") {
            return;
        }

        const fetchContact = async () => {
            const response = await seeReservations({
                fieldId,
                date: selectedDate
            });

            const data = await response.json();
            console.log(data);
            setSlots(data);
        };

        fetchContact();
    }, [selectedDate, fieldId]);

    return <div>
        <div>
            <DatePicker selectedDate={selectedDate} onChange={setSelectedDate}/>
            <FieldSelector fields={fields} value={fieldId} onChange={setFieldId}/>
        </div>
        <div>
            {
                slots && 
                slots.map((slot) => (
                    <ReservationCard key={slot.slot_id} reservationDetails={slot} />
                ))
            }
        </div>
    </div>
};

export default SeeReservations;