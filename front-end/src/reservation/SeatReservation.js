import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
import { assignTable } from "../utils/api";

function SeatReservation() {
    const reservation_id = useParams().reservation_id;
    const history = useHistory();
    const [formError, setFormError] = useState(null);
    // const [tables, setTables] = useState([]);
    // const [reservation, setReservation] = useState({});
    // const [reservationError, setReservationError] = useState(null);
    // const [tablesError, setTablesError] = useState(null);

    // useEffect(loadTablesAndReservation, []);

    // function loadTablesAndReservation() {
    //     const abortController = new AbortController();
    //     setTablesError(null);
    //     setReservationError(null);
    //     readReservation(reservation_id, abortController.signal)
    //         .then(setReservation)
    //         .catch(setReservationError);
    //     listTables(abortController.signal)
    //         .then(setTables)
    //         .catch(setTablesError);
    //     return () => abortController.abort();
    // };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError(null);
        const selected = document.querySelector("select").value;
        const table = tables.find(table => table.table_name == selected);
        const abortController = new AbortController();
        if (reservation.people <= table.capacity) {
            await assignTable(reservation.reservation_id, table.table_id, abortController.signal)
            history.push("/dashboard");
        } else {
            setFormError({message: "Table does not have enough seats."});
        };
    };

    const goBack = (event) => {
        event.preventDefault();
        history.goBack();
    };

    let tables = [
        {
            table_name: "Bar#1",
            capacity: 2,
        },
        {
            table_name: "Bar#2",
            capacity: 4,
        },
    ];

    let reservation = {
        people: 3,
    };

    return (
        <div>
            <ErrorAlert error={formError} />
            <label htmlFor="table_number" >Table Number:</label>
            <select name="table_id" >
                <option value="">-- Select Table --</option>
                {tables.map((table, index) => 
                    <option key={index} value={table.table_name}>{table.table_name} - {table.capacity}</option>)}
            </select>
            <br/>
            <button className="btn btn-secondary" style={{marginRight: 5}} onClick={goBack}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default SeatReservation;