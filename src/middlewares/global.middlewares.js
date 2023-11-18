const mongoose = require('mongoose')
const userService = require('../service/user.service')
const jwt = require("jsonwebtoken")

// verifica de id passado pelos parametros é valido
const validId = (req, res, next) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid id!" });
    }

    next();
}

// verifica se email ja existe no banco de dados na hora do cadastro
const validEmail = async (req, res, next) => {
    const { email } = req.body

    const user = await userService.findByEmail(email)

    if (user != null) {
        return res.send({
            msg: 'Email ja cadastrado...'
        })
    }

    next()
}

// verifica se usuario possui toker
const validToken = async (req, res, next) => {
    const { authorization } = req.headers

    // verifica se authorization esta no formato certo(Bearer Token)
    if(!authorization){
        return res.status(401).send({
            msg: "Nenhum token enviado..."
        })
    }
    const parts = authorization.split(" ")
    if (parts.length != 2 || parts[0] != "Bearer") return res.status(401).send({ msg: "token mal formado..." })
    
    const token = parts[1]

    if (token) {
        // verifica se token é valido
        jwt.verify(token, process.env.SECRET, async (error, decoded) => {
            if (error) return res.status(401).send({msg: "token invalido..."})
        
            const user = await userService.findById(decoded.id)

            if(!user || !user.id){
                return res.status(401).send({msg: "usuario não encotrado..."})
            }
        })

    } else {
        return res.status(401).send({
            msg: "token nao foi gerado..."
        })
    }

    next()
}

module.exports = { validEmail, validId, validToken }