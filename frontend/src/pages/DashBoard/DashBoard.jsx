import { useState } from "react";
import AddField from "./Views/AddField";
import MakeReservation from "./Views/MakeReservation";
import SeeReservations from "./Views/SeeReservations";
import RemoveField from "./Views/RemoveField";

const DASHBOARD_VIEWS = {
    ADD_FIELD: "addField",
    MAKE_RESERVATION: "MakeReservation",
    SEE_RESERVATIONS: "SeeReservations",
    REMOVE_FIELD: "removeField"
}

const DashBoard = () => {

    const [selectedOption, setSelectedOption] = useState();

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

    return (
        <div>
            <header>DashBoard</header>
            <aside>
                <button onClick={ () => setSelectedOption(DASHBOARD_VIEWS.ADD_FIELD) }>Add field</button>
                <button onClick={ () => setSelectedOption(DASHBOARD_VIEWS.REMOVE_FIELD) }>Remove field</button>
                <button onClick={ () => setSelectedOption(DASHBOARD_VIEWS.MAKE_RESERVATION) }>Make reservation</button>
                <button onClick={ () => setSelectedOption(DASHBOARD_VIEWS.SEE_RESERVATIONS) }>See reservations</button>
            </aside>
            <main>
                { renderContent() }
            </main>
        </div>
    )
}

export default DashBoard;