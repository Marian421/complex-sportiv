import { useEffect, useState } from "react";
import DatePicker from "../Components/DatePicker";
import FieldSelector from "../Components/FieldSelector";
import useFieldAndDateManager from "../hooks/useFieldAndDateManager";
import { seeReservations } from "../../../services/api";
import ReservationCard from "../Components/ReservationCard";
import styles from "./styles/SeeReservations.module.css"

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

    const hasReservations = (list) => {
        const thereAreReservations = list.some(object => object.isbooked);
        return thereAreReservations;
    }

    const renderReservations = (slots) => {
        return slots.map((slot) => (
            slot.isbooked &&  <ReservationCard key={slot.slot_id} reservationDetails={slot} />
        ))
    }

    return <div className={ styles.container }>
        <div className={ styles.controls }>
            <DatePicker selectedDate={selectedDate} onChange={setSelectedDate}/>
            <FieldSelector fields={fields} value={fieldId} onChange={setFieldId}/>
        </div>
        <div className={ styles.reservationsContainer }>
            {
                slots && 
                hasReservations(slots) ? renderReservations(slots) : "No reservations"
            }
        </div>
    </div>
};

export default SeeReservations;