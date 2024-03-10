import z from "zod"

export const signupInput=z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string().optional()
})
export type signupInput=z.infer<typeof signupInput>;


export const signinInput=z.object({
    email: z.string().email(),
    password: z.string()
})
export type signinInput=z.infer<typeof signinInput>;



export const createPostInput=z.object({
    title: z.string(),
    content: z.string()
})
export type createPostInput=z.infer<typeof createPostInput>;


export const updatePostInput=z.object({
    title: z.string().optional(),
    content: z.string().optional()
})
export type updatePostInput=z.infer<typeof updatePostInput>;
