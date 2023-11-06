const userService = require('../service/user.service')
const bcrypt = require('bcrypt')

// função de criação de personagem
const create = async (req, res) => {
    const { name, email, password, avatar } = req.body

    if (!name || !email || !password) {
        res.status(400).send({
            msg: 'falha ao criar usuario...'
        })
    } else {
        // passando os dados do body diretamente como paramentro
        await userService.createService(name, email, password, avatar)

        res.status(201).send({
            msg: 'usuario criado com sucesso!',
            response: {
                name,
                email,
                avatar
            }
        })
    }

}

// funçao para buscar todos os usuarios
const findAll = async (req, res) => {
    const users = await userService.findAllServices()

    if (users.legth == 0) {
        return res.staus(400).send({
            msg: 'Nenhum usuario cadastrado...'
        })
    }

    res.status(200).send(users)
}

// funçao para buscar usuario pelo Id
const findById = async (req, res) => {
    const id = req.params.id

    const user = await userService.findByIdService(id)

    if (!user) {
        return res.staus(400).send({
            msg: 'Nenhum usuario encontrado...'
        })
    }

    res.status(200).send(user)

}

// funçao para atualizar dados do usuario
const update = async (req, res) => {
    const { id } = req.params
    const { name, email, password, avatar } = req.body

    const user = await userService.updateService(id, name, email, password, avatar)

    if (user.acknowledged) {
        res.status(200).send({
            status: 'sucesso',
            msg: `${name} modificado com sucesso!`,
            update: user.acknowledged
        })
    } else {
        res.status(400).send({
            status: 'erro',
            msg: `${name} não pode ser modificado!`,
            update: user.acknowledged
        })
    }

}

// funçao para deletar um usuario
const deleteUser = async (req, res) => {
    const { id } = req.params

    const user = await userService.deleteUserService(id)

    if (user.deletedCount > 0) {
        res.status(200).send({
            msg: 'Usuario deletado com sucesso!'
        })
    } else {
        res.status(400).send({
            msg: 'Falha ao deletar usuario...'
        })
    }
}

// funçao de login
const login = async (req, res) => {
    const { email, password } = req.body

    // verifica se email do usuario existe
    const user = await userService.findByEmail(email).select("+password")
    if (!user) {
        return res.status(401).send({
            msg: "Usuario ou senha invalidos..."
        })
    }

    // verifica se email coinside com a senha encriptada
    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
        return res.status(401).send({
            msg: "Usuario ou senha invalidos..."
        })
    }

    res.status(200).send({
        msg: "Login realizado com sucesso!"
    })
}

module.exports = { create, findAll, findById, update, deleteUser, login }


// const findByName = async (req, res) =>{
//     const name = req.params.name
//     const user = await userService.findByName(name)
//     let retornoNome = []

//     for (let i = 0; i < user.length; i++) {
//         if(user[i].name.search(name) != -1){
//             retornoNome.push(user[i])

//         }
//     }

//     if(user.length == 0){
//         return res.status(400).send({
//             msg: 'Nenhum usuario com esse nome...'
//         })
//     }else{
//         return res.status(200).send({
//             status: 'sucesso',
//             response: retornoNome
//         })
//     }
// }