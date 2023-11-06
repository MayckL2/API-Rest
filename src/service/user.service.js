const User = require('../models/User')

// cadatra novo usuario
const createService = (name, email, password, avatar)=> User.create({name, email, password, avatar})

// mostra todos os usuarios cadastrados
const findAllServices = ()=> User.find()

// acha usuario pelo id
const findByIdService = (id)=> User.findById(id)

// atualiza dados do usuario no banco
const updateService = (id, name, email, password, avatar)=> User.updateOne({_id: id}, {name, email, password, avatar})

// deleta usuario do banco
const deleteUserService = (id)=> User.deleteOne({_id: id})

// acha usuario atraves do email
const findByEmail = (email) => User.findOne({email})


module.exports = {createService, findAllServices, findByIdService, updateService, deleteUserService, findByEmail}