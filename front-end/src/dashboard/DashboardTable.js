import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { deleteAssignment } from "../utils/api";

function DashboardTable({ table }) {
    const history = useHistory();

    const handleFinish = async (event) => {
        event.preventDefault();
        if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
          await deleteAssignment(table);
          history.push("/");
        };
      };

    function getStatus() {
        let status = "Occupied"
        if (!table.reservation_id) {
            status = "Free"
        };
        return status;
    };

    return (
        <div className="list-group-item">
            <h6>{table.table_name}:</h6>
            <p data-table-id-status={table.table_id}>{getStatus()}</p>
            {getStatus() === "Occupied" ?
            <button className="btn btn-primary" data-table-id-finish={table.table_id} onClick={handleFinish}>Finish</button>
            : null} 
        </div>
    );
};

export default DashboardTable;