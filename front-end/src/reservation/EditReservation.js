import React, { useState, useEffect } from "react";
import ReservationForm from "./ReservationForm";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function EditReservation() {
    const history = useHistory();
    const reservation_id = useParams().reservation_id;
    const [error, setError] = useState(null)

    const [formData, setFormData] = useState({})

    useEffect(loadReservation, [reservation_id]);

    function loadReservation() {
        setError(null);
        const abortController = new AbortController();
        readReservation(reservation_id, abortController.signal)
            .then(setFormData)
            .catch(setError);
        return () => abortController.abort();
    };

    return (
        <>
        <ErrorAlert error={error} />
        <ReservationForm formData={formData} setFormData={setFormData} history={history} addReservation={false} />
        </>
    )
};

export default EditReservation;