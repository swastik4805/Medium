import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { env } from 'hono/adapter';
import { parseSigned } from 'hono/utils/cookie';
import { sign, verify } from 'hono/jwt';


const blogRouter = new Hono<{
  Bindings:{
    DATABASE_URL: string,
    JWT_SECRET: string
  },
  Variables:{
    userId: string
  }
}>()

blogRouter.use("/*",async (c,next)=>{
    const authHeader=c.req.header("authorization") || "";
    const user=await verify(authHeader,c.env.JWT_SECRET);
    if(user){
        c.set("userId",user.id);
        await next();
    }
    else{
        c.status(403);
        return c.json({
            message: "you are not logged in"
        })
    }
})

blogRouter.post('/',async (c)=>{
    const body=await c.req.json();
    const authorId=c.get("userId")
    const prisma=new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    console.log("hu");
    const blog=await prisma.post.create({
        data:{
            title: body.title,
            content: body.content,
            authorId
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
  

  //pagination should be added here
  blogRouter.get('/bulk',async (c)=>{
    const prisma=new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
    
    const blogs=await prisma.post.findMany();
    // console.log(blogs);
    return c.json({blogs});
  })
  

  
  
  blogRouter.get('/:id',async (c)=>{
    const id=await c.req.param('id')
    const prisma= new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());


    try{
        const blog=await prisma.post.findFirst({
            where:{
                id
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


  

  export default blogRouter