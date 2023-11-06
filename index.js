const express = require('express')
const User = require('./src/models/User')
const app = express()
const userController = require('./src/controller/user.controller')
const cors = require('cors')

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



const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
})