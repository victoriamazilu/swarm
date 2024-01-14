"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { BuzzValidation } from "@/lib/validations/buzz";
import { createBuzz } from "@/lib/actions/buzz.actions";

interface Props {
  userId: string;
}

function PostBuzz({ userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof BuzzValidation>>({
    resolver: zodResolver(BuzzValidation),
    defaultValues: {
      buzz: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof BuzzValidation>) => {
    await createBuzz({
      text: values.buzz,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='buzz'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-dark-2'>
                Content
              </FormLabel>
              <FormControl className='no-focus border border-light-4 bg-light-3 text-dark-1'>
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className='bg-primary-500 text-dark-1' variant='default'>
          Post Buzz
        </Button>
      </form>
    </Form>
  );
}

export default PostBuzz;
