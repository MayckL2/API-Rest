
const Welcome = (req, res) => {
    res.status(200).send({
        status: "sucesso",
        msg: "Requisição feita com sucesso, Bem vindo a API!",
        guide: 'Para cadatrar usuario preencha os campos a seguir',
        required:{
            name: 'João',
            password: '1234',
            email: 'joão@gmail.com',
            avatar: 'https://i.pinimg.com/236x/bc/e2/03/bce2031654b6bf3e55df0f9d96dfa753.jpg'
        }
    })
}

module.exports = {Welcome}