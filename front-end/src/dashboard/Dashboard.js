import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import DashboardReservation from "./DashboardReservation";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ initialDate }) {
  const [date, setDate] = useState(initialDate)
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
    let newDate = new Date(date);
    if (text === "<") {
      newDate.setDate(newDate.getDate() - 1);
    }
    if (text === ">") {
      newDate.setDate(newDate.getDate() + 1);
    }
    newDate = newDate.toISOString().split("T")[0];
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
