import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
import { assignTable, readReservation, listTables } from "../utils/api";

function SeatReservation() {
    const reservation_id = useParams().reservation_id;
    const history = useHistory();
    const [error, setError] = useState(null);
    const [tables, setTables] = useState([]);
    const [reservation, setReservation] = useState({});
 

    useEffect(loadTablesAndReservation, [reservation_id]);

    function loadTablesAndReservation() {
        const abortController = new AbortController();
        setError(null);
        readReservation(reservation_id, abortController.signal)
            .then(setReservation)
            .catch(setError);
        listTables(abortController.signal)
            .then(setTables)
            .catch(setError);
        return () => abortController.abort();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        const selected = document.querySelector("select").value;
        const table = tables.find(table => table.table_name === selected);
        const abortController = new AbortController();
        if (reservation.people > table.capacity) {
            setError({message: "Table does not have enough seats."});
        } else {
            await assignTable(reservation.reservation_id, table.table_id, abortController.signal)
            history.push("/dashboard");
        };
    };

    const goBack = (event) => {
        event.preventDefault();
        history.goBack();
    };

    return (
        <div>
            <ErrorAlert error={error} />
            <label htmlFor="table_number" >Table Number:</label>
            <select name="table_id" >
                <option value="">-- Select Table --</option>
                {tables.map((table, index) => 
                    <option key={index} value={table.table_name}>{table.table_name} - {table.capacity}</option>)}
            </select>
            <br/>
            <button className="btn btn-secondary" style={{marginRight: 5}} onClick={goBack}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} type="submit" >Submit</button>
        </div>
    );
};

export default SeatReservation;