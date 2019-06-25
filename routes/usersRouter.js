const usersRouter = require('express').Router();
const {sendUser} = require('../controllers/usersController')

usersRouter.route('/:username').get(sendUser)


module.exports = usersRouter; 