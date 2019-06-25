const connection = require('../db/connection')

exports.fetchUser = (username) => {
    return connection
    .first('*')
    .from('users')
    .where({'username': username})
}
