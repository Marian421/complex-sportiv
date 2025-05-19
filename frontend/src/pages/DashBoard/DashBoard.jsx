import { useState } from "react";
import AddField from "./Views/AddField";
import MakeReservation from "./Views/MakeReservation";

const DASHBOARD_VIEWS = {
    ADD_FIELD: "addField",
    MAKE_RESERVATION: "MakeReservation" 
}

const DashBoard = () => {

    const [selectedOption, setSelectedOption] = useState();

    const renderContent = () => {
        switch(selectedOption) {
            case DASHBOARD_VIEWS.ADD_FIELD :
                return <AddField />;
            case DASHBOARD_VIEWS.MAKE_RESERVATION :
                return <MakeReservation />
            default : return (<div>stats</div>);
        }
    }

    return (
        <div>
            <header>DashBoard</header>
            <aside>
                <button onClick={ () => setSelectedOption(DASHBOARD_VIEWS.ADD_FIELD) }>Add field</button>
                <button onClick={ () => setSelectedOption(DASHBOARD_VIEWS.MAKE_RESERVATION) }>Make reservation</button>
            </aside>
            <main>
                { renderContent() }
            </main>
        </div>
    )
}

export default DashBoard;