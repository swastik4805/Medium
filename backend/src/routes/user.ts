import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { env } from 'hono/adapter';
import { parseSigned } from 'hono/utils/cookie';
import { sign } from 'hono/jwt';
import { signinInput, signupInput } from '@100xdevs/medium-common';



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
  // console.log("hii");
  // console.log(body);
    const {success}=signupInput.safeParse(body);
    if(!success){
        c.status(400);
        return c.json({message: "wrong type of input"});
    }
    // console.log(body);
	try {
		const user = await prisma.user.create({
			data: {
				username: body.username,
				password: body.password
			}
		});
    // console.log("huuu")
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt });
	} catch(e) {
		c.status(403);
		return c.json({ error: "error while signing upp" });
	}
})



userRouter.post('/signin',async (c) => {
  const prisma=new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body=await c.req.json();
  const {success}=signinInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({message: "wrong type of input sent"});
  }


  const user=await prisma.user.findUnique({
    where:{
      username: body.username,
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