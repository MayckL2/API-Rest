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

// const BookModel = require('./models/book.model')

app.get('/api/', userController.findAll)

// app.get('/api/v1/books/:id', async (req, res) => {
//     try {
//         const data = await BookModel.findById(req.params.id)

//         if (data) {
//             return res.status(200).json({
//                 msg: 'Ok',
//                 data
//             })
//         }

//         return res.status(404).json({
//             msg: 'Not Found',
//         })
//     } catch (error) {
//         return res.status(500).json({
//             msg: error.message
//         })
//     }
// })

// app.post('/api/v1/books', async (req, res) => {
//     try {
//         const { name, author, price, description } = req.body
//         const book = new BookModel({
//             name, author, price, description
//         })
//         const data = await book.save()
//         return res.status(200).json({
//             msg: 'Ok',
//             data
//         })
//     } catch (error) {
//         return res.status(500).json({
//             msg: error.message
//         })
//     }
// })

// app.put('/api/v1/books/:id', async (req, res) => {
//     try {
//         const { name, author, price, description } = req.body
//         const { id } = req.params

//         const data = await BookModel.findByIdAndUpdate(id, {
//             name, author, price, description
//         }, { new: true })

//         return res.status(200).json({
//             msg: 'Ok',
//             data
//         })
//     } catch (error) {
//         return res.status(500).json({
//             msg: error.message
//         })
//     }
// })

// app.delete('/api/v1/books/:id', async (req, res) => {
//     try {
//         await BookModel.findByIdAndDelete(req.params.id)
//         return res.status(200).json({
//             msg: 'Ok',
//         })
//     } catch (error) {
//         return res.status(500).json({
//             msg: error.message
//         })
//     }
// })

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
})