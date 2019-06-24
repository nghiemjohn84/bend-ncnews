
exports.up = function(connection, Promise) {
    console.log('creating users table...')
    return connection.schema.createTable('users', (usersTable) => {
        usersTable.string('username').primary();
        usersTable.string('avatar_url');
        usersTable.string('name').notNullable();
    })
};

exports.down = function(connection, Promise) {
    console.log('removing users tables...')
    return connection.schema.dropTable('users')
};