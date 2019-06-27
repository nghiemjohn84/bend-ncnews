const connection = require('../db/connection');

exports.addVoteToComment = (comment_id, increment = 0) => {
    return connection
    .first('*')
    .from('comments')
    .where('comment_id', comment_id)
    .increment('votes', increment)
    .returning('*')
    .then(([comment]) => {
        if(!comment) {
            return Promise.reject({
                status: 404,
                msg: `Comment ${comment_id} Not Found`
            })
        } else return comment;
    })
}

exports.removeComment = (comment_id) => {
    return connection
    .select('*')
    .from('comments')
    .where('comments.comment_id', comment_id)
    .delete()
    .then((comment) => {
        if(!comment) {
            return Promise.reject({
                status: 404,
                msg: `Comment ${comment_id} Not Found`
            })
        } else return 'Comment Deleted';
    })
}
