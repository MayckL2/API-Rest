const mongoose = require('mongoose')
const User = require('../models/User')

const findAll = async (req, res) => {
    const users = await User.find()

    if (users.legth == 0) {
        return res.staus(400).send({
            msg: 'Nenhum usuario cadastrado...'
        })
    }

    res.status(200).send(users)
}

module.exports = {findAll}