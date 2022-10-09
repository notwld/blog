const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const router = require("express").Router()
const { registerValidation, loginValidation } = require('../middlewares/validate')

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


router.get('/register', async (req, res, next) => {
    if (req.session.user) {
        res.redirect(`http://${req.hostname}:${process.env.PORT}/api/blog/`)
    }
    else {
        res.render('register')
    }
})


router.get('/login', async (req, res, next) => {
    if (req.session.user) {
        res.redirect(`http://${req.hostname}:${process.env.PORT}/api/blog/`)
    }
    else {
        res.render('login')
    }
})

router.post('/register', async (req, res, next) => {
    if (!req.session.user) {
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
                    .then((user) => { return res.status(200).send({ message: "User Registered!", registeredUser: user.name }) })
                    .catch((err) => { return res.status(400).send(err) })
            })
            .catch((err) => { return res.status(400).send(err) })
    }
    else {
        res.redirect(`http://${req.hostname}:${process.env.PORT}/api/user/login`)
    }
})


router.post('/login', async (req, res, next) => {
    if (!req.session.user) {
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
                const session = req.session
                session.token = token
                session.user = user.id
                session.userName = user.name
                // return res.status(200).send({ message: "Logged In!", token: token, user: user.name })
                return res.redirect(`http://${req.hostname}:${process.env.PORT}/api/blog/`)
            })
            .catch((err) => { return res.status(400).send(err) })
    }
    else {
        res.redirect(`http://${req.hostname}:${process.env.PORT}/api/blog/`)
    }
})

router.get('/logout', async (req, res, next) => {
    if (req.session.user) {
        req.session.destroy()
        res.redirect(`http://${req.hostname}:${process.env.PORT}/api/user/login`)
    }
    else {
        res.redirect(`http://${req.hostname}:${process.env.PORT}/api/user/login`)
    }
})

module.exports = router
