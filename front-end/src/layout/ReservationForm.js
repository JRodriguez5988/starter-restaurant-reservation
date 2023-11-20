import React from "react";
import "./ReservationForm.css";
import { createReservation } from "../utils/api";

function ReservationForm({formData, setFormData, reservations, history}) {
    const handleChange = ({target}) => {
        let value = target.value;
        const newFormData = {...formData, [target.name]: value};
        setFormData(newFormData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await createReservation(formData);
        history.push(`/dashboard?date=${formData.reservation_date}`);
    };

    const goBack = (event) => {
        event.preventDefault();
        history.goBack();
    };

    return (
        <>
        <div className="row">
            <div className="col">
                <label htmlFor="first_name">First Name:</label>
                <br/>
                <input
                name="first_name"
                type="text"
                id="first_name"
                onChange={handleChange}
                value={formData.first_name}
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
                value={formData.last_name}
                placeholder="Last Name"
                />
                <br/>
            </div>
        </div>
        <label htmlFor="mobile_number">Mobile #:</label>
        <br/>
        <input 
        name="mobile_number"
        type="text"
        id="mobile_number"
        onChange={handleChange}
        value={formData.mobile_number}
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
                value={formData.reservation_date}
                placeholder="YYYY-MM-DD"
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
                value={formData.reservation_time}
                placeholder="HH:MM"
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
        value={formData.people}
        placeholder="0"
        style={{width: 50}}
        />
        <br/>
        <button onClick={goBack} type="button" className="btn btn-secondary" style={{marginRight: 10}}>Cancel</button>
        <button onClick={handleSubmit} type="submit" className="btn btn-primary">Submit</button>
        </>
    );
};

export default ReservationForm;