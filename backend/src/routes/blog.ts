import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { env } from 'hono/adapter';
import { parseSigned } from 'hono/utils/cookie';
import { sign } from 'hono/jwt';


const blogRouter = new Hono<{
  Bindings:{
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()

// blogRouter.use("/*", (c,next)=>{
//     next();
// })

blogRouter.post('/',async (c)=>{
    const body=await c.req.json();
    const prisma=new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog=await prisma.post.create({
        data:{
            title: body.title,
            content: body.content,
            authorId: "1"
        }
    })
    return c.json({
        id: blog.id
    })
})
  


blogRouter.put('/',async (c)=>{
    const body=await c.req.json();
    const prisma=new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const blog=await prisma.post.update({
        where:{
            id: body.id
        },
        data:{
            title: body.title,
            content: body.content
        }
    })

    return c.json({
        id: body.id
    })
})
  
  
  
  blogRouter.get('/:id',async (c)=>{
    const id=await c.req.param('id')
    const prisma= new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());


    try{
        const blog=await prisma.post.findFirst({
            where:{
                id: id
            }
        })
        return c.json({
            blog
        })
    }
    catch(e){
        c.status(411);
        return c.json({
            message: "something went wrong while fetching"
        })
    }
    
  })

  //pagination should be added here
  blogRouter.get('/bulk',async (c)=>{
    const prisma=new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const blogs=await prisma.post.findMany();
    return c.json(blogs);
  })
  
  

  export default blogRouter