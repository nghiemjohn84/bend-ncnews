const usersRouter = require('express').Router();
const {sendUser} = require('../controllers/usersController')
const {handleMethodErrors} = require('../errors/index')

usersRouter.route('/:username').get(sendUser).all(handleMethodErrors)


module.exports = usersRouter; 