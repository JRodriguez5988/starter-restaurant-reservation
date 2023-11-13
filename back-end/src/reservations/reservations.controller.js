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


async function list(req, res) {
  if (req.query.date) {
    res.json({ data: await reservationsService.listByDate(req.query.date) });
  } else {
    res.json({ data: await reservationsService.list() });
  };
};

async function create(req, res) {
  res.status(201).json({ data: await reservationsService.create(req.body) });
};

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties, 
    hasRequiredProperties, 
    asyncErrorBoundary(create),
  ]
};
