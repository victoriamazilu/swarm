"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { UserValidtion } from "@/lib/validations/user";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface Props {
    user: { 
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string;
}

const AccountProfile = ( { user, btnTitle }: Props ) => {
    const form = useForm({
        resolver: zodResolver(UserValidtion),
        defaultValues: {
            profile_photo: "",
            name: "",
            username: "",
            bio: "",
        }
    });
    return(
        <Form>

        </Form>
    )
}

export default AccountProfile