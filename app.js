const express = require('express');
const app = express();
const apiRouter = require ('./routes/api-router')
const {
    handleCustomErrors, 
    handleServerErrors,
    routeNotFoundError
} = require('./errors/index')

app.use(express.json());

app.use('/api', apiRouter)

app.all('/*', routeNotFoundError) 
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app; 