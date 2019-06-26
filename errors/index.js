exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status) res.status(err.status).send({msg: err.msg})
    else next(err)
}

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error"})
}

exports.routeNotFoundError = (req, res, next) => {
    res.status(404).send({ msg: 'Route not found' })
}

exports.handleSqlErrors = (err, req, res, next) => {
    const sqlErrorCodes = { 
        '22P02': 'Invalid Input'
    };
    if(sqlErrorCodes[err.code]){
    res.status(400).send({msg: sqlErrorCodes[err.code]})
    } else next(err)
}