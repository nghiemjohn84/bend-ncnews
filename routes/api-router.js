const express = require('express');
const apiRouter = express();
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);





module.exports = apiRouter