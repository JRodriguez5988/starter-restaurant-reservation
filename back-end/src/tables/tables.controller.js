const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
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

async function reservationExists(req, res, next) {
    const { data: { reservation_id } = {} } = req.body;
    res.locals.reservation = await reservationsService.read(reservation_id);
    if (!res.locals.reservation) {
        next({
            status: 400,
            message: `Reservation cannot be found: ${reservation_id}.`,
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
    name = name.split("");
    if (name.length === 1) {
        next({
            status: 400,
            message: "Name cannot consist of a single character."
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

function isAlreadySeated(req, res, next) {
    const reservation = res.locals.reservation;
    if (reservation.status === "seated") {
        next({
            status: 400,
            message: `Reservation already seated: ${reservation.reservation_id}.`
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
        asyncErrorBoundary(nameTaken),
        asyncErrorBoundary(create),
    ],
    update: [
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(reservationExists),
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