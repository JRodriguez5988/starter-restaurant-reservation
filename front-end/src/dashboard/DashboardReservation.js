import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { formatAsTime } from "../utils/date-time";

function DashboardReservation({reservation}) {
    const reservation_id = reservation.reservation_id;
    const time = formatAsTime(reservation.reservation_time);
    
    return (
        <>
        {reservation.status === "finished" ? null : 
        <li className="list-group-item">
            <h6 className="card-header">Name: {reservation.first_name} {reservation.last_name}</h6>
            <div className="card-body">
                <p>Phone Number: {reservation.mobile_number}</p>
                <p>Reservation Time: {time}</p>
                <p>Party Size: {reservation.people}</p>
            </div>
            <p className="card-footer" data-reservation-id-status={reservation.reservation_id}>{reservation.status.toUpperCase()}</p>
            {reservation.status === "booked" ? 
            <Link to={`/reservations/${reservation_id}/seat`} href={`/reservations/${reservation_id}/seat`} type="button" className="btn btn-primary">Seat</Link>
            : null}
        </li>}
        </>
    )
}

export default DashboardReservation;