import { useEffect, useState } from "react";
import { fetchTerenuri } from "./services/api";

function App() {
  const [terenuri, setTerenuri] = useState([]);

  useEffect(() => {
    fetchTerenuri().then(setTerenuri);
  }, []);

  return (
    <div>
      <h1>Terenuri disponibile</h1>
      <ul>
        {terenuri.map((teren) => (
          <li key={teren.id}>
            {teren.nume} - {teren.sport} ({teren.capacitate} persoane)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
