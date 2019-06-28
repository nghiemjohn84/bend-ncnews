exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error' });
};

exports.routeNotFoundError = (req, res, next) => {
  res.status(404).send({ msg: 'Route Not Found!' });
};

exports.handleNotFoundSqlErrors = (err, req, res, next) => {
  const sqlErrorCodes = {
    '23503': 'Not Found'
  };
  if (sqlErrorCodes[err.code]) {
    res.status(404).send({ msg: sqlErrorCodes[err.code] });
  } else next(err);
};

exports.handleSqlErrors = (err, req, res, next) => {
  const sqlErrorCodes = {
    '22P02': 'Invalid Input',
    '23502': 'Missing Required Information',
    '42703': 'Invalid Query'
  };
  if (sqlErrorCodes[err.code]) {
    res.status(400).send({ msg: sqlErrorCodes[err.code] });
  } else next(err);
};

exports.handleMethodErrors = (req, res, next) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};
