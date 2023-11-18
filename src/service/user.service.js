const User = require('../models/User')

// cadatra novo usuario
const createService = (data)=> User.create(data)

// mostra todos os usuarios cadastrados
const findAll = (offset, limit)=> User.find().sort({_id: -1}).skip(offset).limit(limit)

// acha usuario pelo id
const findById = (id)=> User.findById(id)

// atualiza dados do usuario no banco
const updateService = (id, name, email, password, avatar, idade, pais, salario, cargo)=> User.updateOne({_id: id}, {name, email, password, avatar, idade, pais, salario, cargo})

// deleta usuario do banco
const deleteUserService = (id)=> User.deleteOne({_id: id})

// acha usuario atraves do email
const findByEmail = (email) => User.findOne({email})

// acha usuario pelo nome
const findByName = (name) => User.find({name: {$regex: `${name || ""}`, $options: "i"}}).sort({_id: -1})

// conta quantidade de usuarios
const count = ()=> User.countDocuments()

module.exports = {createService, findAll, findById, updateService, deleteUserService, findByEmail, findByName, count}