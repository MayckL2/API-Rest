const userService = require('../service/user.service')
const bcrypt = require('bcrypt')

// função de criação de personagem
const create = async (req, res) => {
    var { name, email, password, avatar, idade, pais, salario, cargo } = req.body

    if (!name || !email || !password || !idade || !pais) {
        res.status(400).send({
            msg: 'falha ao cadastrar usuario...'
        })
    } else {
        // se estes valore estiverem vazios, eles são zerados
        if(!avatar) avatar = 'null'
        if(!salario) salario = 0
        if(!cargo) cargo == 'null'

        // passando os dados do body diretamente como paramentro
        const data = {name, email, password, avatar, idade, pais, salario, cargo}
        await userService.createService(data)

        res.status(201).send({
            msg: 'usuario criado com sucesso!',
            response: {
                name,
                email,
                avatar,
                idade,
                pais,
                salario,
                cargo
            }
        })
    }

}

// funçao para buscar todos os usuarios
const findAll = async (req, res) => {
    let {offset, limit} = req.query

    if(!limit){
        limit = 5
    } else{
        limit = Number(limit)
    }
    if(!offset) {
        offset = 0
    }else{
        offset = Number(offset)
    }

    const users = await userService.findAll(offset, limit)
    const total = await userService.count()
    const currentUrl = req.baseUrl

    const nextUrl = offset + limit < total ? `${currentUrl}?limit=${limit}&offset=${offset + limit}` : null
    const previousUrl = offset - limit > 0 ? `${currentUrl}?limit=${limit}&offset=${offset - limit}` : null

    if (users.legth == 0) {
        return res.staus(400).send({
            msg: 'Nenhum usuario cadastrado...'
        })
    }

    res.status(200).send({
        nextUrl,
        previousUrl,
        limit,
        offset,
        total,
        users
    })
}

// funçao para buscar usuario pelo Id
const findById = async (req, res) => {
    const id = req.params.id

    const user = await userService.findById(id)

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
    const { name, email, password, avatar, idade, pais, salario, cargo } = req.body

    const user = await userService.updateService(id, name, email, password, avatar, idade, pais, salario, cargo)

    if (user.acknowledged) {
        res.status(200).send({
            status: 'sucesso',
            msg: `Modificado com sucesso!`,
            update: user.acknowledged
        })
    } else {
        res.status(400).send({
            status: 'erro',
            msg: `Não pode ser modificado!`,
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
        return res.status(404).send({
            msg: "Usuario ou senha invalidos..."
        })
    }

    // verifica se email coinside com a senha encriptada
    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
        return res.status(404).send({
            msg: "Usuario ou senha invalidos..."
        })
    }

    res.status(200).send({
        msg: "Login realizado com sucesso!"
    })
}

const findName = async (req, res) =>{
    const {name} = req.body

    const user = await userService.findByName(name)

    if(user.length == 0){
        res.status(404).send({
            msg: "usuario não encontrado..."
        })
    }else{
        res.status(200).send({
            user
        })
    }
    
}

module.exports = { create, findAll, findById, update, deleteUser, login, findName }