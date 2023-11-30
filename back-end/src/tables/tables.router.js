const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/")
    .get(controller.list);

router.route("/:table_id")
    .get(controller.read);

router.route("/:table_id/seat")
    .put(controller.update);

module.exports = router;