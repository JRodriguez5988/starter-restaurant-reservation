
exports.up = function(knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.integer("people").alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.string("people").alter();
  });
};
