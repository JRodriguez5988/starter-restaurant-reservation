const knex = require("../db/connection");

function list() {
    return knex("reservations").select("*");
}

function listByDate(reservation_date) {
    return knex("reservations")
        .select("*")
        .where({reservation_date: reservation_date});
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
        .where({reservation_id: reservation_id})
        .first();
};

function update(updatedReservation) {
    return knex("reservations")
        .select("*")
        .where({reservation_id: updatedReservation.reservation_id})
        .update(updatedReservation, "*")
        .then((updatedReservations) => updatedReservations[0]);
};

module.exports = {
    list,
    listByDate,
    create,
    read,
    update,
}