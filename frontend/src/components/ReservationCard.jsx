import getTotalPrice from "../services/getTotalPrice";
import formatDate from "../services/formatDate";
import isUpcomingReservation from "../services/isUpcomingReservation";

const ReservationCard = ({ reservation, onCancel }) => {
    const totalPrice = getTotalPrice(reservation.price_per_hour);
    const createdDate = formatDate(reservation.created_at);
    const reservationDate = formatDate(reservation.reservation_date);
    const showCancelButton = isUpcomingReservation(reservation.reservation_date, reservation.slot_name);

    return (
        <div>
            <div>Field Reserved: { reservation.field_name }</div>
            <div>Date: { reservationDate }</div>
            <div>Time interval { reservation.slot_name }</div>
            <div>Price per hour { reservation.price_per_hour }</div>
            <div>Total price { totalPrice }</div>
            <div>Reservation made on { createdDate }</div>
            {showCancelButton && 
                (
                    <div>
                        <button onClick={onCancel}>Cancel reservation</button>
                    </div>
                )}
        </div>
    );
};

export default ReservationCard;