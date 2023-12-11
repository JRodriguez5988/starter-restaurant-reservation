import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import DashboardReservation from "./DashboardReservation";
import DashboardTable from "./DashboardTable";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { today, previous, next } from "../utils/date-time";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const query = useQuery()
  const queryDate = query.get("date") || today();

  const [date, setDate] = useState(queryDate);
  let [year, month, day] = queryDate.split("-");
  month -= 1;
  const headerDate = new Date(year, month, day).toString().slice(0, 15);

  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setError(null);
    setError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);
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

  return (
    <main>
      <h1>Dashboard: {headerDate}</h1>
      <div className="col">
        <button onClick={cycleDate} type="button" className="btn btn-secondary">{"<"}</button>
        <Link to={"/"} type="button" className="btn btn-primary">Today</Link>
        <button onClick={cycleDate} type="button" className="btn btn-secondary">{">"}</button>
      </div>
      <br/>
      <ErrorAlert error={error} />
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
