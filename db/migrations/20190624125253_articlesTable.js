
exports.up = function(connection, Promise) {
    return connection.schema.createTable('articles', (articlesTable) => {
        articlesTable.increments('article_id').primary();
        articlesTable.string('title').notNullable();
        articlesTable.string('topic').references('topics.slug')
        articlesTable.string('author').references('users.username').notNullable();
        articlesTable.text('body').notNullable();
        articlesTable.timestamp('created_at').defaultTo(connection.fn.now())
        articlesTable.integer('votes').defaultTo(0)
    });
};

exports.down = function(connection, Promise) {
    return connection.schema.dropTable('articles')
};