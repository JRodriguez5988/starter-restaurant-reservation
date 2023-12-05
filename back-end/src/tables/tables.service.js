const knex = require("../db/connection");

function list() {
    return knex("tables").select("*");
};

function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((createdTable) => createdTable[0]);
}

function update(updatedTable) {
    return knex("tables")
        .select("*")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable, "*");
};

function read(tableId) {
    return knex("tables")
        .select("*")
        .where({ table_id: tableId })
        .first();
};

module.exports = {
    list,
    create,
    read,
    update,
};