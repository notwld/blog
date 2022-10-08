const express = require("express");
const http = require('http')
const pug = require('pug')

const app = express();

const indexRoutes = require('./routes/indexRoutes')
const blogs = require('./routes/blogs')
const authentication = require('./routes/authentication')

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}));      

//routes
app.use('/',indexRoutes)
app.use('/api/blog',blogs)
app.use('/api/user',authentication)

//error handler
app.all('*', (req, res, next) => {
    res.status(404).send('Not Found');
});
app.use((err,req,res,next)=>{
    res.status(500).send(err)
})

//server (http for now)
http.createServer(app).listen(3000,()=>{
    console.log("Server running on http://localhost:3000")
})