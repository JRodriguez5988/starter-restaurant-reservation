import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ReservationForm from "./ReservationForm";

function CreateReservation() {
    const history = useHistory();

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: ""
    };

    const [formData, setFormData] = useState(initialFormState);

    return (
        <div>
            <h1>New Reservation</h1>
            <section className="border border-dark" style={{padding: 10}}>
                <form>
                    <ReservationForm formData={formData} setFormData={setFormData} history={history} />
                </form>
            </section>
        </div>
    );
};

export default CreateReservation;