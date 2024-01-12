//for form, used for saving user data -pasted from zod
import * as z from 'zod';

export const ThreadValidtion = z.object({
    thread: z.string().min(3, {message: 'Minimum 3 charecters'}),
    accountId: z.string(),
})

export const CommentValidation = z.object({
    thread: z.string().min(1, {message: 'Minimum 1 charecter'}),
})