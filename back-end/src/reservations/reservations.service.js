const knex = require("../db/connection");

function list() {
    return knex("reservations").select("*");
}

function listByDate(reservation_date) {
    return knex("reservations")
        .select("*")
        .where({"reservation_date": reservation_date});
};

function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdReservation) => createdReservation[0]);
};

function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({reservation_id})
        .first();
};

module.exports = {
    list,
    listByDate,
    create,
    read,
}