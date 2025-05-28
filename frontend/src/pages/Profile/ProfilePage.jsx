import { useState } from "react";
import ReservationsHistory from "./Views/ReservationsHistory";
import DeleteAccount from "./Views/DeleteAccount";
import styles from "./ProfilePage.module.css"
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const [selectedOption, setSelectedOption] = useState('history');
    const navigate = useNavigate();

    const renderContent = () => {
        switch(selectedOption) {
            case "history" : return <ReservationsHistory />;
            case "delete" : return <DeleteAccount />;
            default : return null;
        }
    }

    return (
        <div className={ styles.profileContainer }>
            <header className={ styles.header }>
                <FaArrowAltCircleLeft 
                className={ styles.goBack }
                onClick={() => navigate(-1)}
                />
                <span>Profile</span>
            </header>
            <aside className= {styles.sidebar}>
                <button
                   className={`${styles.sidebarButton} ${
                        selectedOption === "history" ? styles.active : ""
                    }`} 
                    onClick={ () => setSelectedOption("history") }>
                        See reservations
                </button>
                <button
                 onClick={ ()=> setSelectedOption("delete") }
                 className={`${selectedOption === "delete" && styles.active}`}>
                    Delete account
                </button>
            </aside>
            <main className={ styles.main }>{ renderContent() }</main>
        </div>
    )
}

export default ProfilePage;