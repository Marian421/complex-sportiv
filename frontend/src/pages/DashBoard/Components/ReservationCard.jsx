const ReservationCard = ({ reservationDetails }) => {
    return (
        <div className="reservationCardAdmin">
            <h2>{ reservationDetails.slot_name }</h2>

            {reservationDetails.isbooked ? renderUserDetails(reservationDetails) : (<span>Is not booked</span>)}
        </div>
    );
};

const renderUserDetails = ( reservationDetails ) => {
    const isGuest = reservationDetails?.guest_name;

    return (
        <>
            {isGuest ? (
                <div>
                    <h2>Guest</h2>
                    <p>Name: { reservationDetails.guest_name }</p>
                    <p>Phone number: { reservationDetails.guest_phone }</p>
                </div>
            ) : (
                <div>
                    <h2>User</h2>
                    <p>Name: { reservationDetails.user_name }</p>
                    <p>E-mail: { reservationDetails.user_email }</p>
                </div>
            )}
        </>
    )
}

export default ReservationCard;