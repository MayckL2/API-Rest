const authService = require("../service/auth.service")

const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const token = await authService.loginService({ email, password });
        return res.status(201).send({token});
    } catch (e) {
        return res.status(401).send({mgs: e.message})
    }
}


module.exports = { login }