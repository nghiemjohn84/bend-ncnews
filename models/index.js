const connection = require('../db/connection')

exports.checkExists = (value, table, column) => {
    return connection
      .select('*')
      .from(table)
      .where(column, value)
      .then(rows => {
        if(rows.length === 0) return false
        else return true
      })
  }