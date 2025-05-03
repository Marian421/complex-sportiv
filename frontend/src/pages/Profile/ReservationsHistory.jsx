import { useEffect, useState } from "react";
import { getReservations } from "../../services/api";

const ReservationsHistory = () => {
    const [reservations, setReservations] = useState(null);

    useEffect(() =>{
        handleFetch();
    }, [])

    const handleFetch = async () => {
        try {
            const response = await getReservations();
            const data = await response.json();
            console.log(data)
            setReservations(data);
        } catch (error) {
            console.error("Couldn't get the reservations", error.message);
        }
    }
    return (
        <div>
            <h2>
                All of your reservations
            </h2>
            <div>
                reservations
            </div> 
        </div>
    )
}

export default ReservationsHistory;