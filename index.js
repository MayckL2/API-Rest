const express = require('express')
const app = express()
const userController = require('./src/controller/user.controller')
const cors = require('cors')
const {validId, validEmail, validToken} = require('./src/middlewares/global.middlewares') 
const home = require('./src/controller/home.controller')
const connectDB = require('./src/database/connectMongo')
const authController = require('./src/controller/auth.controller')

// habilida dotenv
require('dotenv').config()

// habilida uso de json
app.use(express.json())


// conecta com banco de dados
connectDB()

// CORS
app.use((req, res, next) => {
    console.log('Cors funcionando!')
    res.header('Access-Control-Allow-Origin', '*')
    app.use(cors())
    next()
})

// rota para pagina home
app.get('/', home.Welcome)

// rota para exibir todos os usuarios
app.get('/user/', validToken, userController.findAll)

// rota para achar um usuario pelo Id
app.get('/user/:id?', validToken, validId, userController.findById)

// rota para criar um novo usuario
app.post('/user', validEmail, userController.create)

// rota para atualizar as informaçoes de um usuario
app.put('/update/:id?', validToken, validId, validEmail, userController.update)

// rota para deletar usuario
app.delete('/delete/:id?', validToken, validId, userController.deleteUser)

// rota de login
app.post('/login/', authController.login)

// rota para pesquisar usuario pelo nome
app.post('/find/', validToken, userController.findName)

// rota pos login
app.get('/poslogin/', validToken, userController.findAll)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
})