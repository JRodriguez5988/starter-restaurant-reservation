import React, { useState, useEffect } from "react";
import { listReservations } from "../utils/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ReservationForm from "./ReservationForm";

function CreateReservation() {
    const history = useHistory();
    const [reservations, setReservations] = useState();

    // useEffect(() => {
    //     async function read() {
    //         const reservationsFromApi = await listReservations();
    //         setReservations(reservationsFromApi);
    //     };
    //     read();
    // }, []);

    const initialFormState = {
        firstName: "",
        lastName: "",
        mobileNumber: "",
        reservationDate: "",
        reservationTime: "",
        people: ""
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
    }

    const goBack = (event) => {
        event.preventDefault();
        history.goBack();
    };

    return (
        <div>
            <h1>New Reservation</h1>
            <section>
                <form onSubmit={handleSubmit}>
                    <ReservationForm formData={formData} setFormData={setFormData} reservations={reservations} />
                    <button onClick={goBack} type="button" className="btn btn-secondary">Cancel</button>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </section>
        </div>
    );
};

export default CreateReservation;