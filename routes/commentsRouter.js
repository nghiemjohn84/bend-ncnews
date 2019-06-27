const commentsRouter = require('express').Router();
const {amendedComment, deleteComment} = require('../controllers/commentsController')

commentsRouter.route('/:comment_id').patch(amendedComment).delete(deleteComment)


module.exports = commentsRouter;