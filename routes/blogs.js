const { PrismaClient } = require('@prisma/client')
const authorize = require("../middlewares/auth")

const prisma = new PrismaClient()
const router = require("express").Router()

router.get('/', authorize, async (req, res) => {
    if (req.session.user) {
        const blogs = await prisma.user.findMany({
            where: {
                userId: req.session.user.id
            },
            select: {
                name: true,
                posts: true
            }
        })
        // console.log(blogs[4].posts)
        res.render('blogs', { blogs: blogs, user: req.session.userName,id:req.session.user })
    } else {
        res.redirect(`http://${req.hostname}:${process.env.PORT}/api/user/login`)
    }
})

// router.get('/:name', authorize, async (req, res) => {
//     if (req.session.user) {
//         const posts = await prisma.user.findFirst({
//             where: {
//                 name: req.params.name
//             },
//             select: {
//                 name: true,
//                 posts: true
//             }
//         })
//         if (!posts) return res.status(404).send('User not found')
//         return res.status(200).json(posts)
//     } else {
//         res.redirect(`http://${req.hostname}:${process.env.PORT}/api/user/login`)
//     }
// })

router.get('/create', authorize, async (req, res) => {
    if (req.session.user) {
        res.render('create', { user: req.session.userName })
    } else {
        res.redirect(`http://${req.hostname}:${process.env.PORT}/api/user/login`)
    }
})
router.get('/edit/:id', authorize, async (req, res) => {
    if (req.session.user) {
        const post = await prisma.post.findFirst({
            where: {
                id: parseInt(req.params.id)
            }
        })
        if (!post) return res.status(404).send("Post Not Found!")
        res.render('edit', { user: req.session.userName, post: post })
    } else {
        res.redirect(`http://${req.hostname}:${process.env.PORT}/api/user/login`)
    }
})
router.post('/edit/:id', authorize, async (req, res) => {
    if (req.session.user) {
        const post = await prisma.post.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                title: req.body.title,
                slug: req.body.slug,
                post: req.body.post,
            }
        })
        if (!post) return res.status(404).send("Post Not Found!")
        res.redirect(`http://${req.hostname}:${process.env.PORT}/api/blog/`)
    } else {
        res.redirect(`http://${req.hostname}:${process.env.PORT}/api/user/login`)
    }
})
router.post('/delete/:id', authorize, async (req, res) => {
    if (req.session.user) {
        const post = await prisma.post.delete({
            where: {
                id: parseInt(req.params.id)
            },
        })
        if (!post) return res.status(404).send("Post Not Found!")
        res.redirect(`http://${req.hostname}:${process.env.PORT}/api/blog/`)
    } else {
        res.redirect(`http://${req.hostname}:${process.env.PORT}/api/user/login`)
    }
})


router.post('/create', authorize, async (req, res) => {
    if (req.session.user) {
        const post = await prisma.post.create({
            data: {
                title: req.body.title,
                slug: req.body.slug,
                post: req.body.post,
                user: {
                    connect: {
                        id: req.session.user
                    }
                }
            }
        })

        res.redirect(`http://${req.hostname}:${process.env.PORT}/api/blog/`)
    }
    else {
        res.redirect(`http://${req.hostname}:${process.env.PORT}/api/user/login`)
    }
})

router.get('/:id', authorize, async (req, res) => {
    if (req.session.user) {
        const post = await prisma.post.findFirst({
            where: {
                id: parseInt(req.params.id)
            },
            select: {
                title: true,
                slug: true,
                post: true,
                user: {
                    select: {
                        name: true
                    }
                }
            }
        })
        if (!post) return res.status(404).send('Post not found')
        return res.render('post', { post: post, user: req.session.userName })
    } else {
        res.redirect(`http://${req.hostname}:${process.env.PORT}/api/user/login`)
    }
})


// router.delete('/:id', authorize, async (req, res) => {
//     if (req.session.user) {
//         const post = await prisma.post.delete({
//             where: {
//                 id: parseInt(req.params.id)
//             }
//         })
//         if(!post) return res.status(404).send('Post not found')
//         return res.status(200).redirect(`http://${req.hostname}:${process.env.PORT}/api/blog/`)
//     }
//     else {
//         res.redirect(`http://${req.hostname}:${process.env.PORT}/api/user/login`)
//     }
// })


module.exports = router