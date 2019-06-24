
exports.up = function(connection, Promise) {
    console.log('creating articles table...')
    return connection.schema.createTable('articles', (articles_table) => {
        articles_table.increments('article_id').primary();
        articles_table.string('title').notNullable();
        articles_table.string('topic').references('topics.slug')
        articles_table.string('author').references('users.username')
        articles_table.string('body').notNullable();
        articles_table.timestamps('created_at')
        articles_table.integer('votes').defaultTo(0)
    });
};

exports.down = function(connection, Promise) {
    console.log('removing articles tables...')
    return connection.schema.dropTable('articles')
};