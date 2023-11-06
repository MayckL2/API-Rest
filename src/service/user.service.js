const User = require('../models/User')

// mostra todos os usuarios cadastrados
const findAllServices = ()=> User.find()

module.exports = {findAllServices}