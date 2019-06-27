const connection = require('../db/connection');

exports.addVoteToComment = (comment_id, increment) => {
    return connection
    .first('*')
    .from('comments')
    .where('comment_id', comment_id)
    .increment('votes', increment)
    .returning('*')
    .then(([comment]) => comment)

}

exports.removeComment = (comment_id) => {
    return connection
    .select('*')
    .from('comments')
    .where('comments.comment_id', comment_id)
    .delete()
}