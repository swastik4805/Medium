import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { env } from 'hono/adapter';
import { parseSigned } from 'hono/utils/cookie';
import { sign } from 'hono/jwt';


const app = new Hono<{
  Bindings:{
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()  



app.post('/api/v1/signup', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
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



app.post('/api/v1/user/signin',async (c) => {
  const prisma=new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body=await c.req.json();
  const user=await prisma.user.findUnique({
    where:{
      email:body.email,
      password: body.password
    }
  })
  if(!user){
    c.status(403);
    return c.json({error:"username doesn't exist"})
  }
  const jwt=await sign({id: user.id},c.env.JWT_SECRET)
  return c.json({jwt})
})




app.post('/api/v1/blog',(c)=>{
  return c.text('this is the signup page');
})

app.put('/api/v1/blog',(c)=>{
  return c.text('this is the signup page');
})

app.get('/api/v1/blog/:id',(c)=>{
  return c.text('this is the signup page');
})

app.get('/api/v1/blog/bulk',(c)=>{
  return c.text('this is the signup page');
})



export default app
//DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWNjNDdlMjctZjQwNS00YjBiLWEwNGEtNzNjZTdlYjA0OWIyIiwidGVuYW50X2lkIjoiNWMxZDkyNTA4ZTE0OTVlMzc4MTgyMmYzOTZmY2Y2Y2Q2OGQ3NjI5Yzc0MzYzMzY5OThhN2QwMjRkNDA5NDhkMSIsImludGVybmFsX3NlY3JldCI6ImM5ODFjZDBkLWI4NzgtNGM4NC05YzU3LWQ5NjY5ZGU4NTk3OCJ9.qtg1lEZmedrGOSn_DyFWPwWkKs_VQ5pDfpOFTnrI-lY"