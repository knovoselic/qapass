
exports.up = function(knex, Promise) {
    return knex.schema.createTable('accounts', (table) => {
        table.bigIncrements('id');
        table.string('username').nullable();
        table.string('password').nullable();
        table.string('host').nullable();
        table.string('description').nullable();
        table.boolean('public').notNullable().default(false);
        table.bigInteger('user_id').notNullable().unsigned();

        table.foreign('user_id').references('id').inTable('users').onDelete('cascade');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('accounts');
};
