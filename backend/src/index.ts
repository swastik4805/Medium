import { Hono } from 'hono'

const app = new Hono()


app.post('/api/v1/user/signup',(c)=>{
  return c.text('this is the signup page');
})

app.post('/api/v1/user/signin', (c) => {
  return c.text('Hello Hono!')
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
