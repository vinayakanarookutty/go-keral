import { z } from "zod"
export const sessionSchema=z.object({
    email:z.string(),
    name:z.string(),
})
