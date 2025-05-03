import getTotalPrice from "../services/getTotalPrice";
import formatDate from "../services/formatDate";

const ReservationCard = ({ reservation }) => {
    const totalPrice = getTotalPrice(reservation.price_per_hour);
    const createdDate = formatDate(reservation.created_at);
    const reservationDate = formatDate(reservation.reservation_date);

    return (
        <div>
            <div>Field Reserved: { reservation.field_name }</div>
            <div>Date: { reservationDate }</div>
            <div>Time interval { reservation.slot_name }</div>
            <div>Price per hour { reservation.price_per_hour }</div>
            <div>Total price { totalPrice }</div>
            <div>Reservation made on { createdDate }</div>
        </div>
    );
};

export default ReservationCard;