const jwt = require('jsonwebtoken')

const authorize = (req, res, next) => {
    const token = req.session.token
    if (!token) return res.redirect(`http://${req.hostname}:${process.env.PORT}/api/user/login`)
    try {
        const verified = jwt.verify(token, process.env.SECRET_TOKEN)
        req.user = verified
        next();
    } catch (err) {
        res.status(400).send("Invalid Token")
    }
}

module.exports = authorize;