import React, { useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { formatAsTime } from "../utils/date-time";
import { cancelReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function DashboardReservation({reservation}) {
    const reservation_id = reservation.reservation_id;
    const time = formatAsTime(reservation.reservation_time);
    const [error, setError] = useState(null);

    const handleCancel = async (event) => {
        event.preventDefault();
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            setError(null);
            const abortController = new AbortController();
            try {
                await cancelReservation(reservation_id, abortController.signal);
                window.location.reload()
            } catch (error) {
                setError(error);
            };
            return () => abortController.abort();
        };
    };
    
    return (
        <>
        <ErrorAlert error={error} />
        <li className="list-group-item">
            <div className="card-header" style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <h6>Name: {reservation.first_name} {reservation.last_name}</h6>
                {reservation.status === "booked" ? 
                <div>
                    <Link to={`/reservations/${reservation_id}/seat`} href={`/reservations/${reservation_id}/seat`} type="button" className="btn btn-primary" style={{marginRight: 5}}>Seat</Link>
                    <Link to={`/reservations/${reservation_id}/edit`} href={`/reservations/${reservation.reservation_id}/edit`} type="button" className="btn btn-secondary">Edit</Link>
                </div>
                : null}
            </div>
            <div className="card-body">
                <p>Phone Number: {reservation.mobile_number}</p>
                <p>Reservation Time: {time}</p>
                <p>Party Size: {reservation.people}</p>
            </div>
            <div className="card-footer" style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <p data-reservation-id-status={reservation_id}>{reservation.status.toUpperCase()}</p>            
                {reservation.status === "booked" ? 
                <button data-reservation-id-cancel={reservation_id} className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                : null}
            </div>
        </li>
        </>
    )
}

export default DashboardReservation;