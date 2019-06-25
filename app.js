const express = require('express');
const app = express();
const apiRouter = require ('./routes/api-router')

app.use(express.json());

app.use('/api', apiRouter)

app.use((err, req, res, next) => {
})


module.exports = app; 