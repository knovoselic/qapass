
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', (table) => {
        table.bigincrements('id');
        table.string('email', 40).notNullable().unique();
        table.string('password').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
