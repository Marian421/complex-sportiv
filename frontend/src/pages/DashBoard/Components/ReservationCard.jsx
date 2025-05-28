import styles from "./styles/ReservationCard.module.css"

const ReservationCard = ({ reservationDetails }) => {
    return (
        <div className="reservationCardAdmin">
            {reservationDetails.isbooked ? renderUserDetails(reservationDetails) : (<span>Is not booked</span>)}
        </div>
    );
};

const renderUserDetails = ( reservationDetails ) => {
    const isGuest = reservationDetails?.guest_name;

    return (
        <>
            {isGuest ? (
                <div className={ styles.userCard }>
                    <h2 className={ styles.time }>{ reservationDetails.slot_name }</h2>
                    <p>Name: <span>{ reservationDetails.guest_name } (guest)</span> </p>
                    <p>Phone number: <span>{ reservationDetails.guest_phone }</span></p>
                </div>
            ) : (
                <div className={ styles.userCard}>
                    <h2 className={ styles.time }>{ reservationDetails.slot_name }</h2>
                    <p>Name: <span>{ reservationDetails.user_name } (user)</span></p>
                    <p>E-mail: <span>{ reservationDetails.user_email }</span></p>
                </div>
            )}
        </>
    )
}

export default ReservationCard;