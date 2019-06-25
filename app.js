const express = require('express');
const app = express();
const apiRouter = require ('./routes/api-router')
const {
    handleCustomErrors, 
    handleServerErrors
} = require('./errors/index')


app.use(express.json());

app.use('/api', apiRouter)

app.all('/*', (req, res, next) => {
res.status(404).send({ msg: 'Route not found' });
}) 

app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app; 