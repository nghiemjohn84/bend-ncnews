const articlesRouter = require('express').Router();
const {
    sendAllArticles,
    sendArticleById,
    updateArticleVote,
    postCommentByArticleId
} = require('../controllers/articlesController')

const {handleMethodErrors} = require('../errors/index')

articlesRouter.route('/')
    .get(sendAllArticles)
    .all(handleMethodErrors)

articlesRouter.route('/:article_id')
    .get(sendArticleById)
    .patch(updateArticleVote)
    .all(handleMethodErrors)

articlesRouter.route('/:article_id/comments')
    .post(postCommentByArticleId)



module.exports = articlesRouter
