const userService = require('../service/user.service')
const bcrypt = require('bcrypt')
const { sendEmailService } = require('../service/sendEmail')

// função de criação de personagem
const create = async (req, res) => {
    var { name, email, password, avatar, idade, pais, salario, cargo } = req.body

    // verificando se os dados necessarios foram preenchidos
    if (!name || !email || !password || !idade || !pais) {
        res.status(400).send({
            msg: 'falha ao cadastrar usuario...'
        })
    } else {
        // se estes valore estiverem vazios, eles são zerados
        if (!avatar) avatar = 'null'
        if (!salario) salario = 0
        if (!cargo) cargo == 'null'

        // passando os dados do body diretamente como paramentro
        const data = { name, email, password, avatar, idade, pais, salario, cargo }
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
    let { offset, limit } = req.query

    // se limit e offset estiverem vazios, atribue-se valores a eles
    if (!limit) {
        limit = 5
    } else {
        limit = Number(limit)
    }
    if (!offset) {
        offset = 0
    } else {
        offset = Number(offset)
    }

    // busca todos os usuarios
    const users = await userService.findAll(offset, limit).select("+password")
    // conta todos quando usuarios existem
    const total = await userService.count()
    // pega o endpoint atual
    const currentUrl = req.baseUrl

    // baseado na url atual, gerasse a url para o offset posterior/anterior
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

    // busca id do usuario no banco
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

    // proibindo que usuario atualize a senha atraves desta rota
    if(password){
        return res.status(404).send({
            msg: "Para troca de senha faça a requisição de uma nova senha..."
        })
    }

    // atualizando dados
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

    // busca usuario pelo id e o deleta
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

// procura usuario pelo nome
const findName = async (req, res) => {
    const { name } = req.body

    // busca nome do usuario no banco
    const user = await userService.findByName(name)

    if (user.length == 0) {
        res.status(404).send({
            msg: "usuario não encontrado..."
        })
    } else {
        res.status(200).send({
            user
        })
    }

}

// manda email para o usuario para troca de senha
const sendEmail = async (req, res) => {
    const { email } = req.body

    // verifica se email do usuario esta cadastrado
    const user = await userService.findByEmail(email)
    if (!user) {
        return res.status(404).send({
            msg: "Não existe usuario cadastrado com este email..."
        })
    }

    // funçao para gerar numeros aleatorios
    const random = ()=>{
        return String(Math.round(Math.random() * 9))
    }
    // console.log(random(), random(), random(), random(), random())
    
    // envia o codigo para o email do usuario
    let code = random() + random() + random() + random() + random()
    sendEmailService(email, code)

    res.status(201).send({
        msg: "Email enviado com sucesso!"
    })
}

// troca a senha do usuario
const changePassword = async (req, res) => {
    const { email, newPassword } = req.body

    // verifica se email do usuario esta cadastrado
    const user = await userService.findByEmail(email)
    if (!user) {
        return res.status(404).send({
            msg: "Não existe usuario cadastrado com este email..."
        })
    }

    // encriptação da senha do usuario na hora do cadastro
    let password = await bcrypt.hash(newPassword, 10)

    // troca senha e mantem os outros dados
    const change = await userService.updateService(user._id, user.name, user.email, password, user.avatar, user.idade, user.pais, user.salario, user.cargo)
    if(change.acknowledged){
        res.send({
            msg: "Senha alterada com sucesso!"
        })
    }
    
}

module.exports = { create, findAll, findById, update, deleteUser, login, findName, sendEmail, changePassword }