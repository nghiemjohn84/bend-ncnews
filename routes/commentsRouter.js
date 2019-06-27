const commentsRouter = require('express').Router();
const {amendedComment, deleteComment} = require('../controllers/commentsController')
const {handleMethodErrors} = require('../errors/index')

commentsRouter.route('/:comment_id')
    .patch(amendedComment)
    .delete(deleteComment)
    .all(handleMethodErrors)


module.exports = commentsRouter;