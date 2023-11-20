import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import DashboardReservation from "./DashboardReservation";
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

  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
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
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="col">
        <button onClick={cycleDate} type="button" className="btn btn-secondary">{"<"}</button>
        <Link to={"/"} type="button" className="btn btn-primary">Today</Link>
        <button onClick={cycleDate} type="button" className="btn btn-secondary">{">"}</button>
      </div>
      <ol>
        {reservations.map((reservation, index) => 
        <DashboardReservation key={index} reservation={reservation} />)}
      </ol>
    </main>
  );
}

export default Dashboard;
