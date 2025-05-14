import { useState } from "react";
import ReservationsHistory from "./ReservationsHistory";
import DeleteAccount from "./DeleteAccount";

const ProfilePage = () => {
    const [selectedOption, setSelectedOption] = useState('history');

    const renderContent = () => {
        switch(selectedOption) {
            case "history" : return <ReservationsHistory />;
            case "delete" : return <DeleteAccount />;
            default : return null;
        }
    }

    return (
        <div>
            <header>Profile</header>
            <aside>
                <button onClick={ () => setSelectedOption("history") }>See reservations</button>
                <button onClick={ ()=> setSelectedOption("delete") }>Delete account</button>
            </aside>
            <main>{ renderContent() }</main>
        </div>
    )
}

export default ProfilePage;