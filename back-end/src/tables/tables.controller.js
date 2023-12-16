const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
    "table_name",
    "capacity"
  );

const VALID_PROPERTIES = [
    "reservation_id",
    "table_name",
    "capacity",
];

function hasReservationId(req, res, next) {
    const { data: { reservation_id } = {} } = req.body;
    if (!reservation_id) {
        next({
            status: 400,
            message: "reservation_id is missing."
        });
    };
    next();
}

async function reservationExists(req, res, next) {
    const { data: { reservation_id } = {} } = req.body;
    res.locals.reservation = await reservationsService.read(reservation_id);
    if (!res.locals.reservation) {
        next({
            status: 404,
            message: `Reservation cannot be found: ${reservation_id}.`,
        });
    };
    next();
};

function isAlreadySeated(req, res, next) {
    const { status } = res.locals.reservation;

    if (status === "seated") {
        next({
            status: 400,
            message: "Reservation is already seated."
        });
    };
    next();
};

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

function nameLengthValid(req, res, next) {
    let name = req.body.data.table_name;
    if (name.length === 1) {
        next({
            status: 400,
            message: `table_name cannot consist of a single character: '${name}'.`
        });
    };
    next()
};

async function nameTaken(req, res, next) {
    let tables = await tablesService.list();
    let name = req.body.data.table_name;
    if (tables.find(table => table.table_name === name)) {
        next({
            status: 400,
            message: "Table name already exists."
        });
    };
    next();
};

function capacityIsNumber(req, res, next) {
    const capacity = req.body.data.capacity;
    if (typeof capacity !== "number") {
      next({
        status: 400,
        message: `capacity value is not a number: ${capacity}`
      });
    };
    next();
  };

function capacityIsSufficient(req, res, next) {
    const { capacity } = res.locals.table;
    const { people } = res.locals.reservation;

    if (capacity < people) {
        next({
            status: 400,
            message: `Table capacity, ${capacity}, is not sufficient to seat the party size, ${people}.`
        });
    };
    next();
};

async function tableExists(req, res, next) {
    const table_id = req.params.table_id;
    res.locals.table = await tablesService.read(table_id)
    if (!res.locals.table) {
        next({
            status: 404,
            message: `Table not found: ${table_id}`,
        }); 
    };
    next();
};

function isOccupied(req, res, next) {
    const table = res.locals.table;
    if (!table.reservation_id) {
        next({
            status: 400,
            message: "Table is not occupied.",
        });
    };
    next();
};

function isNotOccupied(req, res, next) {
    const table = res.locals.table;
    if (table.reservation_id) {
        next({
            status: 400,
            message: `Table is occupied: ${table.table_id}.`
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
};

async function create(req, res) {
    res.status(201).json({ data: await tablesService.create(req.body.data) });
};

function read(req, res) {
    const table = res.locals.table;
    res.json({ data: table });
};

async function update(req, res) {
    const table = res.locals.table;
    const reservation = res.locals.reservation;
    const { data: { reservation_id } = {} } = req.body;
    const updatedTable = {
        table_id: table.table_id,
        reservation_id: reservation_id,
        table_name: table.table_name,
        capacity: table.capacity,
    };
    const updatedReservation = {
        reservation_id: reservation.reservation_id,
        first_name: reservation.first_name,
        last_name: reservation.last_name,
        mobile_number: reservation.mobile_number,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
        people: reservation.people,
        status: "seated",
      };
    await reservationsService.update(updatedReservation);
    res.json({ data: await tablesService.update(updatedTable) });
};

async function deleteAssignment(req, res) {
    const table = res.locals.table;
    const reservation = await reservationsService.read(table.reservation_id);
    const updatedTable = {
        table_id: table.table_id,
        reservation_id: null,
        table_name: table.table_name,
        capacity: table.capacity,
    };
    const updatedReservation = {
        reservation_id: reservation.reservation_id,
        first_name: reservation.first_name,
        last_name: reservation.last_name,
        mobile_number: reservation.mobile_number,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
        people: reservation.people,
        status: "finished",
      };
    await reservationsService.update(updatedReservation);
    const [ data ] = await tablesService.update(updatedTable);
    res.json({ data: data })
};

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        hasOnlyValidProperties,
        hasRequiredProperties,
        nameLengthValid,
        capacityIsNumber,
        asyncErrorBoundary(nameTaken),
        asyncErrorBoundary(create),
    ],
    update: [
        hasOnlyValidProperties,
        asyncErrorBoundary(tableExists),
        isNotOccupied,
        hasReservationId,
        asyncErrorBoundary(reservationExists),
        capacityIsSufficient,
        isAlreadySeated,
        asyncErrorBoundary(update),
    ],
    read: [
        asyncErrorBoundary(tableExists),
        read,
    ],
    clear: [
        asyncErrorBoundary(tableExists),
        isOccupied,
        asyncErrorBoundary(deleteAssignment),
    ],
};