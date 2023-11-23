import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import TableForm from "./TableForm";

function CreatTable() {
    const history = useHistory();

    const intitialFormState = {
        table_name: "",
        capacity: "",
    };

    const [formData, setFormData] = useState(intitialFormState);

    return (
        <div>
            <h1>New Table</h1>
            <section className="border border-dark" style={{padding: 10}}>
                <TableForm formData={formData} setFormData={setFormData} history={history} />
            </section>
        </div>
    );
};

export default CreatTable;