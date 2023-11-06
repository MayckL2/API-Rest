const mongoose = require('mongoose')
const userService = require('../service/user.service')

// verifica de id passado pelos parametros é valido
 const validId = (req, res, next) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid id!" });
    }

    next();
}

// verifica se email ja existe no banco de dados na hora do cadastro
 const validEmail = async (req, res, next) =>{
    const {email} = req.body

    const user = await userService.findByEmail(email)

    if(user != null){
        return res.send({
            msg: 'Email ja cadastrado...'
        })
    }

    next()
}

module.exports = {validEmail, validId}