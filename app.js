const express = require('express');
const app = express();
const apiRouter = require ('./routes/api-router')

app.use(express.json());

app.use('/api', apiRouter)

app.all('/*', (req, res, next) => {
    res.status(404).send({ msg: 'Route not found' });
}) 

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error"})
})

module.exports = app; 