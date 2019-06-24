
exports.up = function(connection, Promise) {
    return connection.schema.createTable('comments', (commentsTable) => {
        commentsTable.increments('comment_id')
        commentsTable.string('author').references('users.username')
        commentsTable.integer('article_id').references('articles.article_id');
        commentsTable.integer('votes').defaultTo(0);
        commentsTable.timestamps('created_at');
        commentsTable.string('body')

    })
};

exports.down = function(connection, Promise) {
    console.log('removing users tables...')
    return connection.schema.dropTable('comments')
};