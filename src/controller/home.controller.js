
const Welcome = (req, res) => {
    res.status(200).send({
        status: "sucesso",
        msg: "Requisição feita com sucesso, Bem vindo a API!",
    })
}

const guideUser = (req, res)=>{
    res.status(200).send({
        status: 'sucesso',
        msg: 'Para cadatrar usuario preencha os campos a seguir',
        required:{
            name: 'string',
            password: 'string',
            email: 'string',
            avatar: 'string'
        }
    })
}

module.exports = {Welcome, guideUser}