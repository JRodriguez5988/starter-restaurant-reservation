/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "first_name", 
  "last_name", 
  "mobile_number", 
  "reservation_date",
  "reservation_time",
  "people",
  );

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
];

const VALID_STATUS = [
  "booked",
  "seated",
  "finished",
];

async function reservationExists(req, res, next) {
  const reservation_id = req.params.reservation_id;
  const reservation = await reservationsService.read(reservation_id);
  if (!reservation) {
    next({
      status: 404,
      message: `Reservation not found: ${reservation_id}.`
    })
  }
  res.locals.reservation = reservation;
  next();
}

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

function isValidDate(req, res, next) {
  const date = req.body.data.reservation_date;
  if (isNaN(new Date(date))) {
    next({
      status: 400,
      message: `reservation_date is invalid: ${date}`
    });
  };
  next();
};

function notTuesday(req, res, next) {
  let [year, month, day] = req.body.data.reservation_date.split("-");
  month -= 1;
  const date = new Date(year, month, day).getDay();
  if (date === 2) {
    next({
      status: 400,
      message: `Restaurant closed on Tuesdays.`
    });
  };
  next();
};

function notPastDate(req, res, next) {
  let [year, month, day] = req.body.data.reservation_date.split("-");
  month -= 1;
  let [hh, mm] = req.body.data.reservation_time.split(":");
  const requestDate = new Date(year, month, day, hh, mm);
  const today = new Date()
  if (requestDate < today) {
    next({
      status: 400,
      message: `Date must be today or a future date.`
    });
  };
  next();
};

function isValidTime(req, res, next) {
  const time = req.body.data.reservation_time;
  const isValid = /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)
  if (!isValid) {
    next({
      status: 400,
      message: `reservation_time is invalid: ${time}`
    });
  };
  next();
};

function duringOpenHours(req, res, next) {
  let time = req.body.data.reservation_time;
  const openingTime = "10:30";
  const closingTime = "21:30";
  if (time < openingTime || time > closingTime) {
    next({
      status: 400,
      message: `Reservation time must set during business hours.`
    });
  };
  next();
};

function peopleIsNumber(req, res, next) {
  const people = req.body.data.people;
  if (typeof people !== "number") {
    next({
      status: 400,
      message: `people value is not a number: ${people}`
    });
  };
  next();
};

function notSeatedOrFinished(req, res, next) {
  const status = req.body.data.status;
  if (status === "seated" || status === "finished") {
    next({
      status: 400,
      message: `Status cannot be 'seated' or 'finished'. Status submitted: ${status}.`
    });
  };
  next();
};

function statusisValid(req, res, next) {
  const status = req.body.data.status;

  if(!VALID_STATUS.includes(status)) {
    next({
      status: 400,
      message: `Status is invalid: ${status}.`
    });
  };
  next();
};

function alreadyFinished(req, res, next) {
  const status = res.locals.reservation.status;
  if (status === "finished") {
    next({
      status: 400,
      message: "A finished reservation cannot be updated."
    });
  };
  next();
};

async function list(req, res) {
  let data;
  if (req.query.date) {
    data = await reservationsService.listByDate(req.query.date);
    data = data.filter(reservation => reservation.status !== "finished");
  } else if (req.query.mobile_number) {
    data = await reservationsService.search(req.query.mobile_number);
  } else {
    data = await reservationsService.list();
  };
  const sortedData = data.sort((a, b) => {
    const timeA = a.reservation_time;
    const timeB = b.reservation_time;
    if (timeA > timeB) {
      return 1;
    } else if (timeA < timeB) {
      return -1;
    } else {
      return 0;
    };
  });
  res.json({ data: sortedData });
};

async function create(req, res) {
  res.status(201).json({ data: await reservationsService.create(req.body.data) });
};

function read(req, res) {
  const reservation = res.locals.reservation;
  res.json({ data: reservation});
};

async function update(req, res) {
  const reservation = res.locals.reservation;
  const { data: { status } = {} } = req.body;
  const updatedReservation = {
    reservation_id: reservation.reservation_id,
    first_name: reservation.first_name,
    last_name: reservation.last_name,
    mobile_number: reservation.mobile_number,
    reservation_date: reservation.reservation_date,
    reservation_time: reservation.reservation_time,
    people: reservation.people,
    status: status,
  };
  res.status(200).json({ data: await reservationsService.update(updatedReservation)})
};

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties, 
    hasRequiredProperties,
    isValidDate,
    notTuesday,
    notPastDate,
    isValidTime,
    duringOpenHours,
    peopleIsNumber,
    notSeatedOrFinished,
    asyncErrorBoundary(create),
  ],
  read: [
    asyncErrorBoundary(reservationExists),
    read,
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    alreadyFinished,
    statusisValid,
    asyncErrorBoundary(update),
  ],
};
