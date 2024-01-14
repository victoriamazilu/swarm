import * as z from "zod";

export const BuzzValidation = z.object({
  buzz: z.string().min(3, { message: "Minimum 3 characters." }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  buzz: z.string().min(3, { message: "Minimum 3 characters." }),
});
