
exports.up = function(knex, Promise) {
    return knex.schema.createTable('accounts', (table) => {
        table.bigIncrements('id');
        table.string('username').nullable().unique();
        table.string('password').nullable().unique();
        table.string('host').nullable().unique();
        table.string('description').nullable().unique();
        table.boolean('public').notNullable().default(false);
        table.bigInteger('user_id').notNullable().unsigned();

        table.foreign('user_id').references('id').inTable('users').onDelete('cascade');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('accounts');
};
