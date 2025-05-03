import { useEffect, useState } from "react";
import { getReservations } from "../../services/api";
import formatDate from "../../services/formatDate";
import ReservationCard from "../../components/ReservationCard";
import filterDates from "../../services/filterDates";

const ReservationsHistory = () => {
    const [reservations, setReservations] = useState([]);
    const [dateFilter, setDateFilter] = useState("all");

    const filterdReservations = filterDates(reservations, dateFilter);

    useEffect(() =>{
        const handleFetch = async () => {
            try {
                const response = await getReservations();
                const data = await response.json();
                console.log(data);
                setReservations(data);
            } catch (error) {
                console.error("Couldn't get the reservations", error.message);
            }
        }

        handleFetch();
    }, [])

   // const handleCancel = () => {

   // }

    return (
        <div>
            <h2>
                All of your reservations
            </h2>

            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="past">Past</option>
                <option value="upcoming">Upcoming</option>
                <option value="today">Today</option>
            </select>

            <h2>Total: { filterdReservations.length }</h2>

            <div>
                {filterdReservations.map((reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation}></ReservationCard>
                ))}
            </div> 
        </div>
    )
}

export default ReservationsHistory;