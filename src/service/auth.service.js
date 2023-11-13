const jwt = require("jsonwebtoken")
const User = require('../models/User')
const bcrypt = require('bcrypt')

function generateToken(id) {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: 86400 });
}

const loginService = async ({ email, password }) => {
    const user = await User.findOne({email}).select("+password");

    if (!user) throw new Error("Usuario ou senha incorretos...");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new Error("Senha incorreta...");

    const token = generateToken(user.id);

    return token;
}

module.exports = {generateToken, loginService}