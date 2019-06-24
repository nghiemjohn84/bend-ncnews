
exports.up = function(connection, Promise) {
    console.log('creating topics table...')
    return connection.schema.createTable('topics', (topicsTable) => {
        topicsTable.string('slug').primary()
        topicsTable.string('description').notNullable();
    })
};

exports.down = function(connection, Promise) {
    console.log('removing topics tables...')
    return connection.schema.dropTable('topics')
};
