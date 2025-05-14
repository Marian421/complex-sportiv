import { useState } from "react";
import AddField from "./AddField";

const DASHBOARD_VIEWS = {
    ADD_FIELD: "addField"
}

const DashBoard = () => {

    const [selectedOption, setSelectedOption] = useState();

    const renderContent = () => {
        switch(selectedOption) {
            case DASHBOARD_VIEWS.ADD_FIELD :
                 return <AddField />;
            default : return (<div>stats</div>);
        }
    }

    return (
        <div>
            <header>DashBoard</header>
            <aside>
                <button onClick={ () => setSelectedOption(DASHBOARD_VIEWS.ADD_FIELD) }>Add field</button>
            </aside>
            <main>
                { renderContent() }
            </main>
        </div>
    )
}

export default DashBoard;