const articlesRouter = require('express').Router();
const {
    sendAllArticles,
    sendArticleById,
    updateArticleVote
} = require('../controllers/articlesController')

articlesRouter.route('/').get(sendAllArticles)

articlesRouter.route('/:article_id').get(sendArticleById).patch(updateArticleVote)








module.exports = articlesRouter
