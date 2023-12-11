import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { formatMobileNumber } from "../utils/mobile-number";
import { searchReservations } from "../utils/api";
import DashboardReservation from "../dashboard/DashboardReservation";

function Search() {
    const [number, setNumber] = useState();
    const [error, setError] = useState(null);
    const [reservations, setReservations] = useState([]);

    function isValid(number) {
        console.log(number);
        let result = true;
        if (!number) {
            setError({message: "Please enter a phone number."});
            result = false;
        } else if (!(number.match('[0-9]'))) {
            setError({message: "Search criteria must consist of numbers."});
            result = false;
        };
        return result;
    }

    const handleChange = ({target}) => {
        let value = target.value
        setNumber(value);
    };

    const handleClick = async (event) => {
        event.preventDefault();
        if (isValid(number)) {
            setError(null);
            const formatted = formatMobileNumber(number)
            setNumber(formatted);
            console.log(formatted)
            try {
                const abortController = new AbortController();
                const reservationsFromApi = await searchReservations(number, abortController.signal);
                setReservations(reservationsFromApi);
            } catch (error) {
                setError(error);
            };
        }
    }
    return (
        <>
        <form>
            <ErrorAlert error={error} />
            <h4 htmlFor="mobile_number">Search for reservation by phone number:</h4>
            <input 
                name="mobile_number"
                type="tel"
                id="mobile_number"
                onChange={handleChange}
                placeholder="Enter a customer's phone number"
                pattern="[0-9]{10}"
                maxLength={10}
                style={{marginRight: 10}}
            />
            <button type="submit" className="btn btn-primary" onClick={handleClick}>Find</button>
        </form>
        <div>
            {reservations.length ? reservations.map((reservation, index) => 
            <DashboardReservation key={index} reservation={reservation} />) : "No reservations found"}
        </div>
        </>

    )
};

export default Search;