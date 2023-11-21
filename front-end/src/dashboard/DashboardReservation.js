import React from "react";

function DashboardReservation({reservation}) {
    return (
        <li className="list-group-item">
            <h6 className="card-header">Name: {reservation.first_name} {reservation.last_name}</h6>
            <div className="card-body">
                <p>Time: {reservation.reservation_time}</p>
                <p>Party Size: {reservation.people}</p>
            </div>
        </li>
    )
}

export default DashboardReservation;