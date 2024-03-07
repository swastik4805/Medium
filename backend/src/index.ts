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
//DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWNjNDdlMjctZjQwNS00YjBiLWEwNGEtNzNjZTdlYjA0OWIyIiwidGVuYW50X2lkIjoiNWMxZDkyNTA4ZTE0OTVlMzc4MTgyMmYzOTZmY2Y2Y2Q2OGQ3NjI5Yzc0MzYzMzY5OThhN2QwMjRkNDA5NDhkMSIsImludGVybmFsX3NlY3JldCI6ImM5ODFjZDBkLWI4NzgtNGM4NC05YzU3LWQ5NjY5ZGU4NTk3OCJ9.qtg1lEZmedrGOSn_DyFWPwWkKs_VQ5pDfpOFTnrI-lY"