import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { env } from 'hono/adapter';
import { parseSigned } from 'hono/utils/cookie';
import { sign } from 'hono/jwt';
import { signinInput, signupInput } from '@aefgh4805/common-app';



const userRouter = new Hono<{
    Bindings:{
      DATABASE_URL: string,
      JWT_SECRET: string
    }
  }>()  


userRouter.post('/signup', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
    const {success}=signupInput.safeParse(body);
    if(!success){
        c.status(400);
        return c.json({message: "wrong type of input"});
    }
    // console.log(body);
	try {
		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: body.password
			}
		});
    console.log(user)
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt });
	} catch(e) {
		c.status(403);
		return c.json({ error: "error while signing up" });
	}
})



userRouter.post('/signin',async (c) => {
  const prisma=new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body=await c.req.json();
  const {success}=signinInput.safeParse(body);
  if(!success){
    c.status(400);
    return c.json({message: "wrong type of input sent"});
  }
  const user=await prisma.user.findUnique({
    where:{
      email:body.email,
      password: body.password
    }
  })
  if(!user){
    c.status(403);
    return c.json({error:"wrong username or password"})
  }
  const jwt=await sign({id: user.id},c.env.JWT_SECRET)
  return c.json({jwt})
})

export default userRouter