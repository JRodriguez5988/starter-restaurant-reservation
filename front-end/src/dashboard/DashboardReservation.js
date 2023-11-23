import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";

function DashboardReservation({reservation}) {
    const reservation_id = reservation.reservation_id;
    return (
        <li className="list-group-item">
            <h6 className="card-header">Name: {reservation.first_name} {reservation.last_name} {`(${reservation.mobile_number})`}</h6>
            <div className="card-body">
                <p>Time: {reservation.reservation_time}</p>
                <p>Party Size: {reservation.people}</p>
            </div>
            <Link to={`/reservations/${reservation_id}/seat`} href={`/reservations/${reservation_id}/seat`} type="button" className="btn btn-primary">Seat</Link>
        </li>
    )
}

export default DashboardReservation;