const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const authorize = require("../middlewares/auth")
const router = require("express").Router()

router.get('/',authorize,async (req,res)=>{
    const posts = await prisma.user.findMany({
        select:{
            name:true,
            posts:true
        }
    })
    return res.status(200).json(posts)
})

router.get('/:name',authorize,async (req,res)=>{
    const posts = await prisma.user.findFirst({
        where:{
            name:req.params.name
        },
        select:{
            name:true,
            posts:true
        }
    })
    if(!posts) return res.status(404).send('User not found')
    return res.status(200).json(posts)
})

router.post('/create',authorize,async(req,res)=>{
    const post =await prisma.post.create({
        data:{
            title:req.body.title,
            post:req.body.post,
            user:{
                connect:{
                    id:parseInt(res.user)
                }
            }
        }
    })

    return res.status(200).json({message:"Post Created",post:post})
})

module.exports = router