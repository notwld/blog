const jwt = require('jsonwebtoken')

const authorize = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send("Access Denied!");

    try {
        const verify = jwt.verify(token, process.env.SECRET_TOKEN);
        res.user = verify;
        next();
    } catch (error) {
        return res.status(400).send("Invalid Token!");
    }
}

module.exports = authorize;