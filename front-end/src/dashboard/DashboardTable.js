import React from "react";

function DashboardTable({ table }) {
    function isSeated() {
        return true;
    };

    return (
        <div className="list-group-item">
          <h6>{table.table_name}:</h6>
          <p data-table-id-status={table.table_id}>{isSeated() ? "Occupied" : "Free"}</p>
        </div>
    );
};

export default DashboardTable;