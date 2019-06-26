const articlesRouter = require('express').Router();
const {
    sendAllArticles,
} = require('../controllers/articlesController')

articlesRouter.route('/').get(sendAllArticles)






module.exports = articlesRouter
