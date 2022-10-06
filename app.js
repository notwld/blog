const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const inserUser = async () => {
    const user = await prisma.user.create({
        data: {
            name: "waleed",
            email: "notwld@gmail.com",
        }
    })
    return user
}
const insertPost = async () => {
    const post = await prisma.post.create({
        data: {
           post:"niggadeen",
           userId:1
        }
    })
    return post
}
// insertPost()
// console.log(inserUser()
//     .then((res)=>
//             {
//                 return res
//             }
//         ).catch((err)=>{
//            return  err
//         })
// )

// const getUser = async () => {
//     const user = await prisma.user.findFirst({
//         where: {
//             id: 1
//         }
//     })
//     console.log(user)
// }
const getPost = async () => {
    const post = await prisma.user.findFirst({
        where: {
            id: 1
        },
        include:{
            // posts:true
            _count:{
                select:{
                    posts:{
                        where:{
                            id:1
                        }
                    }
                }
            }
        }
    })
    console.log(post)
}

// getUser()
getPost()

const getAllusers = async ()=>{
    const users = await prisma.user.findMany({
        where:{
            name:"waleed"
        },
        include:{
            _count:true
        }

    })
    console.log(users)
}

// getAllusers()