import { useState } from "react";
import AddField from "./Views/AddField";
import MakeReservation from "./Views/MakeReservation";
import SeeReservations from "./Views/SeeReservations";
import RemoveField from "./Views/RemoveField";
import styles from "./DashBoard.module.css"

const DASHBOARD_VIEWS = {
    ADD_FIELD: "addField",
    MAKE_RESERVATION: "MakeReservation",
    SEE_RESERVATIONS: "SeeReservations",
    REMOVE_FIELD: "removeField"
}

const DashBoard = () => {

    const [selectedOption, setSelectedOption] = useState(DASHBOARD_VIEWS.ADD_FIELD);

    const renderContent = () => {
        switch(selectedOption) {
            case DASHBOARD_VIEWS.ADD_FIELD :
                return <AddField />;
            case DASHBOARD_VIEWS.MAKE_RESERVATION :
                return <MakeReservation />;
            case DASHBOARD_VIEWS.SEE_RESERVATIONS :
                return <SeeReservations />;
            case DASHBOARD_VIEWS.REMOVE_FIELD :
                return <RemoveField />
            default : return (<div>stats</div>);
        }
    }

    const setButtonClassNames = (option) => {
        return `${option === selectedOption ? styles.active : ""}`
    }

    return (
        <div className={ styles.dashboardContainer }>
            <header className={ styles.header }>DashBoard</header>
            <aside className={ styles.sidebar }>
                <button 
                className={setButtonClassNames(DASHBOARD_VIEWS.ADD_FIELD)} 
                onClick={ () => setSelectedOption(DASHBOARD_VIEWS.ADD_FIELD) }>
                    Add field
                </button>
                <button className={setButtonClassNames(DASHBOARD_VIEWS.REMOVE_FIELD)} onClick={ () => setSelectedOption(DASHBOARD_VIEWS.REMOVE_FIELD) }>Remove field</button>
                <button className={setButtonClassNames(DASHBOARD_VIEWS.MAKE_RESERVATION)} onClick={ () => setSelectedOption(DASHBOARD_VIEWS.MAKE_RESERVATION) }>Make reservation</button>
                <button className={setButtonClassNames(DASHBOARD_VIEWS.SEE_RESERVATIONS)} onClick={ () => setSelectedOption(DASHBOARD_VIEWS.SEE_RESERVATIONS) }>See reservations</button>
            </aside>
            <main className={ styles.main }>
                { renderContent() }
            </main>
        </div>
    )
}

export default DashBoard;