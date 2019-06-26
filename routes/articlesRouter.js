const articlesRouter = require('express').Router();
const {
    sendAllArticles,
    sendArticleById
} = require('../controllers/articlesController')

articlesRouter.route('/').get(sendAllArticles)
articlesRouter.route('/:article_id').get(sendArticleById)








module.exports = articlesRouter
