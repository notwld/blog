const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const router = require("express").Router()
const { registerValidation, loginValidation } = require('../middlewares/validate')

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res, next) => {
    const user = await prisma.user.findFirst({
        where: {
            email: req.body.email
        }
    })

    if (user) return res.status(400).send("User Already Exists!")

    const hashPass = await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10))
    const validate = registerValidation(req.body)
        .then(async (response) => {
            const saveUser = await prisma.user.create({
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    password: hashPass
                }
            })
                .then((user) => { return res.status(200).send({ saveUser: saveUser.id }) })
                .catch((err) => { return res.status(400).send(err) })
        })
        .catch((err) => { return res.status(400).send(err) })
})

router.post('/login', async (req, res, next) => {
    const user = await prisma.user.findFirst({
        where: {
            email: req.body.email
        }
    })

    if (!user) return res.status(400).send("User doesn't exists!")

    const validate = loginValidation(req.body)
        .then(async (response) => {
            const compare = bcrypt.compareSync(req.body.password, user.password)
            if (!compare) return res.status(400).send("Invalid Password")

            const token = jwt.sign(user.id, process.env.SECRET_TOKEN)
            return res.status(200).send({ user: token })
        })
        .catch((err) => { return res.status(400).send(err) })
})

module.exports = router
