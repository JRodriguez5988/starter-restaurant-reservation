import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import DashboardReservation from "./DashboardReservation";
import DashboardTable from "./DashboardTable";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { today, previous, next } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const queryParameters = new URLSearchParams(window.location.search);
  const queryDate = queryParameters.get("date") || today();

  const [date, setDate] = useState(queryDate);
  let [year, month, day] = queryDate.split("-");
  month -= 1;
  const headerDate = new Date(year, month, day).toString().slice(0, 15);

  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  // const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    // listTables(abortController.signal)
    //   .then(setTables)
    //   .catch(setTablesError);
    return () => abortController.abort();
  }

  const cycleDate = (event) => {
    event.preventDefault();
    let text = event.target.innerText;
    let newDate;
    if (text === "<") {
      newDate = previous(date)
    }
    if (text === ">") {
      newDate = next(date);
    }
    setDate(newDate)
    history.push(`/dashboard?date=${newDate}`);
  };

  const tables = ([
    {
      table_name: "Bar #1",
      capacity: 4,
    },
    {
      table_name: "Bar #2",
      capacity: 2,
    },
  ])

  return (
    <main>
      <h1>Dashboard: {headerDate}</h1>
      <div className="col">
        <button onClick={cycleDate} type="button" className="btn btn-secondary">{"<"}</button>
        <Link to={"/"} type="button" className="btn btn-primary">Today</Link>
        <button onClick={cycleDate} type="button" className="btn btn-secondary">{">"}</button>
      </div>
      <br/>
      <ErrorAlert error={reservationsError} />
      <div className="row">
        <div className="col-7">
          <h4 className="card-header mb-0">Reservations:</h4>
          <ul className="list-group list-group-flush">
            {reservations.map((reservation, index) => 
            <DashboardReservation key={index} reservation={reservation} />)}
          </ul>
        </div>
        <div className="col-5">
          <h4 className="card-header">Tables:</h4>
          <div>
            {tables.map((table, index) => 
            <DashboardTable key={index} table={table} />)}
          </div>
        </div>        
      </div>

    </main>
  );
}

export default Dashboard;
