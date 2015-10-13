
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function (table) {
        table.string('user_id').unique();
        table.timestamps();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};
