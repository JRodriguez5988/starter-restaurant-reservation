import React from "react";

function DashboardTable({ table }) {
    let status;
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
        </div>
    );
};

export default DashboardTable;