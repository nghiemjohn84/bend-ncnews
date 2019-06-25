const {fetchUser} = require('../models/usersModel')

exports.sendUser = (req, res, next) => {
const {username} = req.params
fetchUser(username).then((user) => {
res.status(200).send({user}) 
  }).catch(next)
}