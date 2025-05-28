import getTotalPrice from "../services/getTotalPrice";
import formatDate from "../services/formatDate";
import isUpcomingReservation from "../services/isUpcomingReservation";
import styles from "./styles/ReservationCard.module.css"

const ReservationCard = ({ reservation, onCancel }) => {
    const totalPrice = getTotalPrice(reservation.price_per_hour);
    const createdDate = formatDate(reservation.created_at);
    const reservationDate = formatDate(reservation.reservation_date);
    const showCancelButton = isUpcomingReservation(reservation.reservation_date, reservation.slot_name);

    return (
        <div className={ styles.container }>
            <div className={ styles.details }>Field Reserved: <span>{ reservation.field_name }</span></div>
            <div className={ styles.details }>Date: <span>{ reservationDate }</span></div>
            <div className={ styles.details }>Time interval: <span>{ reservation.slot_name }</span></div>
            <div className={ styles.details }>Price per hour: <span>{ reservation.price_per_hour }</span></div>
            <div className={ styles.details }>Total price: <span>{ totalPrice }</span></div>
            <div className={ styles.details }>Reservation made on: <span>{ createdDate }</span></div>
            {showCancelButton && 
                (
                    <div>
                        <button className={ styles.delete } onClick={onCancel}>Cancel reservation</button>
                    </div>
                )}
        </div>
    );
};

export default ReservationCard;