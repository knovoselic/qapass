
exports.up = function(knex, Promise) {
    return knex.schema.createTable('api_keys', (table) => {
        table.bigIncrements('id');
        table.string('key').notNullable().unique();
        table.string('secret').notNullable().unique();
        table.datetime('last_usage_at').nullable();
        table.bigInteger('user_id').notNullable().unsigned();

        table.foreign('user_id').references('id').inTable('users').onDelete('cascade');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('api_keys');
};
