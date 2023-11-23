import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import "./TableForm.css";

function TableForm({ formData, setFormData, history }) {
    const handleChange = ({target}) => {
        let value = target.value;
        if (target.name === "capacity") {
            value = Number(value);
        };
        const newFormData = {...formData, [target.name]: value};
        setFormData(newFormData);
    };

    const goBack = (event) => {
        event.preventDefault();
        history.goBack();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        history.push("/dashboard");
    }

    return (
        <form>
            <div>
                <label htmlFor="table_name" >Table Name:</label>
                <br/>
                <input 
                name="table_name"
                type="text"
                id="table_name"
                onChange={handleChange}
                value={formData.table_name}
                placeholder="Name"
                />
                <br/>
                <label htmlFor="capacity" >Capacity:</label>
                <br/>
                <input
                name="capacity"
                type="text"
                id="capacity"
                onChange={handleChange}
                value={formData.capacity}
                placeholder="0"
                />                
            </div>
            <br/>
            <button onClick={goBack} type="button" className="btn btn-secondary" style={{marginRight: 10}}>Cancel</button>
            <button onClick={handleSubmit} type="submit" className="btn btn-primary">Submit</button>                
        </form>
    );
};

export default TableForm;