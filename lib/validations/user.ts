//for form used for saving user data
import * as z from 'zod';

export const UserValidtion = z.object({
    profile_phto: z.string().url().nonempty(),
    name: z.string().min(2, { message: 'Minimum 2 charecters'}).max(30),
    username: z.string().min(3, { message: 'Minimum 3 charecters'}).max(30),
    bio: z.string().min(1, { message: 'Minimum 1 charecter'}).max(800),
})