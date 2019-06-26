const topicsRouter = require('express').Router();
const {sendTopics} = require('../controllers/topicsController')
const {handleMethodErrors} = require('../errors/index')

topicsRouter.route('/').get(sendTopics).all(handleMethodErrors)



module.exports = topicsRouter;