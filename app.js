const express = require('express');
const app = express();
const apiRouter = require ('./routes/api-router')
const {
    handleCustomErrors, 
    handleServerErrors,
    routeNotFoundError,
    handleSqlErrors,
} = require('./errors/index')

app.use(express.json());

app.use('/api', apiRouter)

app.use('/*', routeNotFoundError) 

app.use(handleCustomErrors)
app.use(handleSqlErrors)
app.use(handleServerErrors)

module.exports = app; 