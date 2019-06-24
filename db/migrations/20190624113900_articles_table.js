
exports.up = function(connection, Promise) {
    console.log('creating articles table...')
    return connection.schema.createTable('articles', (articles_table) => {
        articles_table.increments('article_id').primary();
        articles_table.string('title').notNullable();
        articles_table.string('topic').notNullable();
        articles_table.string('author').notNullable();
        articles_table.string('body').notNullable();
        articles_table.decimal('created_at').notNullable();
        articles_table.decimal('votes');
    });
};

exports.down = function(connection, Promise) {
    console.log('removing articles tables...')
    return connection.schema.dropTable('articles')
};