import React from "react";

function DashboardTable({ table }) {
    function isSeated() {
        let result = true
        if (!table.reservation_id) {
            result = false;
        };
        return result;
    };

    return (
        <div className="list-group-item">
          <h6>{table.table_name}:</h6>
          <p data-table-id-status={table.table_id}>{isSeated() ? "Occupied" : "Free"}</p>
        </div>
    );
};

export default DashboardTable;