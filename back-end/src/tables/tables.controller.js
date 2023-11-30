const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
    "table_name",
    "capacity"
  );

const VALID_PROPERTIES = [
    "table_name",
    "capacity",
];

function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;

    const invalidFields = Object.keys(data).filter((field) => {
        !VALID_PROPERTIES.includes(field)
    });

    if (invalidFields.length) {
        return next({
        status: 400,
        message: `Invalid field(s): ${invalidFields.join(", ")}`
        });
    };
    next();
};

async function list(req, res) {
    let data = await tablesService.list();
    const sortedData = data.sort((a, b) => {
      const nameA = a.table_name;
      const nameB = b.table_name;
      if (nameA > nameB) {
        return 1;
      } else if (nameA < nameB) {
        return -1;
      } else {
        return 0;
      };
    });
    res.json({ data: sortedData });
}

async function tableExists(req, res, next) {
    const table_id = req.params.table_id;
    res.locals.table = await tablesService.read(table_id)
    if (!res.locals.table) {
        next({
            status: 400,
            message: "Table not found",
        }); 
    };
    next();
};

function read(req, res) {
    const table = res.locals.table;
    res.json({ data: table });
};

async function update(req, res) {
    const table = res.locals.table;
    const { data: { reservation_id } = {} } = req.body;
    const updatedTable = {
        table_id: table.table_id,
        reservation_id: reservation_id,
        table_name: table.table_name,
        capacity: table.capacity,
    };

    res.json({ data: await tablesService.update(updatedTable) });
};

module.exports = {
    list: asyncErrorBoundary(list),
    update: [
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(update),
    ],
    read: [
        asyncErrorBoundary(tableExists),
        read,
    ],
};