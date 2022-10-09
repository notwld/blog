const express = require("express");
const http = require('http')
const pug = require('pug')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const app = express();

const indexRoutes = require('./routes/indexRoutes')
const blogs = require('./routes/blogs')
const authentication = require('./routes/authentication')

//template engine
app.set('view engine', 'pug')

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
    secret: process.env.SECRET_TOKEN,
    resave: false,
    maxAge: 1000 * 60 * 60 * 24,
    saveUninitialized: false,
    cookie: { secure: false }
}))

//routes
app.use('/', indexRoutes)
app.use('/api/blog', blogs)
app.use('/api/user', authentication)

//error handler
app.all('*', (req, res, next) => {
    res.status(404).send('Not Found');
});
app.use((err, req, res, next) => {
    res.status(500).send(err)
})

//server (http for now)
http.createServer(app).listen(process.env.PORT, () => {
    console.log("Server running on http://localhost:3000")
})