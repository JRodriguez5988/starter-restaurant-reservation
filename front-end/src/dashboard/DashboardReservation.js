import React from "react";

function DashboardReservation({reservation}) {
    return (
        <li className="col">
            <p>Name: {reservation.first_name} {reservation.last_name}</p>
            <p>Time: {reservation.reservation_time}</p>
            <p>Party Size: {reservation.people}</p>
        </li>
    )
}

export default DashboardReservation;