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
  "people"
  );

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
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
  const requestDate = new Date(year, month, day);
  const today = new Date();
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

async function list(req, res) {
  let data;
  if (req.query.date) {
    data = await reservationsService.listByDate(req.query.date);
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

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties, 
    hasRequiredProperties,
    isValidDate,
    notTuesday,
    notPastDate,
    isValidTime,
    peopleIsNumber,
    asyncErrorBoundary(create),
  ]
};
