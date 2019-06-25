
exports.up = function(connection, Promise) {
    return connection.schema.createTable('articles', (articlesTable) => {
        articlesTable.increments('article_id').primary();
        articlesTable.string('title').notNullable();
        articlesTable.string('topic').references('topics.slug')
        articlesTable.string('author').references('users.username')
        articlesTable.text('body').notNullable();
        articlesTable.string('created_at')
        articlesTable.integer('votes').defaultTo(0)
    });
};

exports.down = function(connection, Promise) {
    return connection.schema.dropTable('articles')
};