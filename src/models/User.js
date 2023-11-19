const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    avatar:{
        type: String,
        required: true
    },
    idade:{
        type: Number,
        required: true
    },
    pais:{
        type: String,
        required: true
    },
    salario:{
        type: Number,
        required: true
    },
    cargo:{
        type: String,
        required: true
    },
    ativo:{
        type: Boolean,
        default: true
    },
    criacao:{
        type: String,
        required: true
    }
})

// encriptação da senha do usuario na hora do cadastro
userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User