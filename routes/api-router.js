const express = require('express');
const apiRouter = express();
const topicsRouter = require('./topicsRouter');

apiRouter.use('/topics', topicsRouter);



module.exports = apiRouter