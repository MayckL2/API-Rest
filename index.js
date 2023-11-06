const express = require('express')
const User = require('./src/models/User')
const app = express()
const userController = require('./src/controller/user.controller')
const cors = require('cors')
const {validId, validEmail} = require('./src/middlewares/global.middlewares') 

require('dotenv').config()

app.use(express.json())

const connectDB = require('./src/database/connectMongo')

connectDB()

// CORS
app.use((req, res, next) => {
    console.log('Cors funcionando!')
    res.header('Access-Control-Allow-Origin', '*')
    app.use(cors())
    next()
})

app.get('/user/', userController.findAll)

// rota para achar um usuario pelo Id
app.get('/user/:id?', validId, userController.findById)

// rota para criar um novo usuario
app.post('/user', validEmail, userController.create)

// rota para atualizar as informaçoes de um usuario
app.put('/update/:id?', validId, validEmail, userController.update)

// rota para deletar usuario
app.delete('/delete/:id?', validId, userController.deleteUser)

// rota de login
app.post('/login/', userController.login)


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
})