const express = require('express');
const apiRouter = express();
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');
const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');
const {handleMethodErrors} = require('../errors/index')
const endpoints = require('../endpoints.json')


apiRouter.route('/')
    .get((req,res) => res.status(200).send(endpoints))
    .all(handleMethodErrors)

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);


module.exports = apiRouter;
