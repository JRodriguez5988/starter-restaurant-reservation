import React, { useState } from "react";
import "./ReservationForm.css";
import { createReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { formatMobileNumber } from "../utils/mobile-number";

function ReservationForm({formData, setFormData, history, addReservation = true}) {
    const [formError, setFormError] = useState(null)

    function isValid(formData) {
        let result = true

        let [year, month, day] = formData.reservation_date.split("-");
        month -= 1;

        const time = formData.reservation_time;
        let [hh, mm] = time.split(":");

        const date = new Date(year, month, day, hh, mm);

        const weekday = date.getDay();

        const currentDate = new Date();

        const openingTime = "10:30";
        const closingTime = "21:30";

        if (weekday === 2) {
            setFormError({message: "Restaurant is closed on Tuesdays."});
            result = false;
        };
        if (currentDate > date) {
            setFormError({message: "Date and time must be in the future."});
            result = false;
        };
        if (time < openingTime || time > closingTime) {
            setFormError({message: "Reservation time must be set during business hours."});
            result = false;
        };
        const number = formData.mobile_number.replace(/\D+/g, '');
        if (!(number.match('[0-9]{10}'))) {
            setFormError({message: "Mobile Number must be a valid phone number."});
            result = false;
        }
        return result;
    };

    const handleChange = ({target}) => {
        let value = target.value;
        if (target.name === "people") {
            value = Number(value);
        };
        const newFormData = {...formData, [target.name]: value};
        setFormData(newFormData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isValid(formData)) {
            formData.mobile_number = formatMobileNumber(formData.mobile_number);
            setFormError(null);
            const abortController = new AbortController();
            try {
                if (addReservation) {
                    console.log(addReservation);
                    await createReservation(formData, abortController.signal);
                } else {
                    await updateReservation(formData, abortController.signal);
                }
                history.push(`/dashboard?date=${formData.reservation_date}`);
            } catch (error) {
                setFormError(error)
            };
            return () => abortController.abort();
        };
    };

    const goBack = (event) => {
        event.preventDefault();
        history.goBack();
    };

    return (
        <form>
        <ErrorAlert error={formError} />
        <div className="row">
            <div className="col">
                <label htmlFor="first_name">First Name:</label>
                <br/>
                <input
                name="first_name"
                type="text"
                id="first_name"
                onChange={handleChange}
                value={formData.first_name || ""}
                placeholder="First Name"
                />
                <br/>
            </div>
            <div className="col">
                <label htmlFor="last_name">Last Name:</label>
                <br/>
                <input
                name="last_name"
                type="text"
                id="last_name"
                onChange={handleChange}
                value={formData.last_name || ""}
                placeholder="Last Name"
                />
                <br/>
            </div>
        </div>
        <label htmlFor="mobile_number">Mobile #:</label>
        <br/>
        <input 
        name="mobile_number"
        type="tel"
        id="mobile_number"
        onChange={handleChange}
        value={formData.mobile_number || ""}
        placeholder="Mobile #"
        />
        <br/>
        <div className="row">
            <div className="col">
                <label htmlFor="reservation_date">Reservation Date:</label>
                <br/>
                <input
                name="reservation_date"
                type="date"
                id="reservation_date"
                onChange={handleChange}
                value={formData.reservation_date || ""}
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
                />
                <br/>
            </div>
            <div className="col">
                <label htmlFor="reservation_time">Reservation Time:</label>
                <br/>
                <input
                name="reservation_time"
                type="time"
                id="reservation_time"
                onChange={handleChange}
                value={formData.reservation_time || ""}
                placeholder="HH:MM"
                pattern="[0-9]{2}:[0-9]{2}"
                />
            </div>
        </div>
        <br/>
        <label htmlFor="people" style={{marginRight: 5}}>Party Size:</label>
        <input
        name="people"
        type="number"
        id="people"
        onChange={handleChange}
        value={formData.people || ""}
        placeholder="0"
        style={{width: 50}}
        />
        <br/>
        <button onClick={goBack} type="button" className="btn btn-secondary" style={{marginRight: 10}}>Cancel</button>
        <button onClick={handleSubmit} type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

export default ReservationForm;