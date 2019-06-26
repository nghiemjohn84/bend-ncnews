const articlesRouter = require('express').Router();
const {
    sendAllArticles,
    sendArticleById,
    updateArticleVote
} = require('../controllers/articlesController')

const {handleMethodErrors} = require('../errors/index')

articlesRouter.route('/').get(sendAllArticles).all(handleMethodErrors)

articlesRouter.route('/:article_id')
    .get(sendArticleById)
    .patch(updateArticleVote)
    .all(handleMethodErrors)








module.exports = articlesRouter
