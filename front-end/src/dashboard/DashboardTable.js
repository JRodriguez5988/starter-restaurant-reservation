import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { deleteAssignment } from "../utils/api";

function DashboardTable({ table }) {
    const history = useHistory();
    let status;

    const handleDelete = async (event) => {
        event.preventDefault();
        if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
          await deleteAssignment(table);
          history.push("/");
        };
      };

    function isSeated() {
        let result = true
        status = "Occupied"
        if (!table.reservation_id) {
            result = false;
            status = "Free"
        };
        return result;
    };

    return (
        <div className="list-group-item">
            <h6>{table.table_name}:</h6>
            <p data-table-id-status={table.table_id}>{!isSeated() ? "Free" : "Occupied"}</p>
            {status = "Occupied" ?
            <button className="btn btn-primary" data-table-id-finish={table.table_id} onClick={handleDelete}>Finish</button>
            : null} 
        </div>
    );
};

export default DashboardTable;