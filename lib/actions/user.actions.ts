"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

export async function updateUser({
    userId, 
    username,
    name,
    bio,
    image,
    path,
}: Params): Promise<void> {
    connectToDB();
    try {
        await User.findOneAndUpdate(
            {id: userId},
            {username: username.toLowerCase() ,
                name,
                bio, 
                image, 
                onboarded: true
            },
            {upsert: true}, //update and insert if not found
        );

        if(path === '/profile/edit'){
            revalidatePath(path);
        }

    } catch (error: any) {
        throw new Error(`Failed to update user ${error.message}`);
    }
}

export async function fetchUser(userId: string) {
    try {
        connectToDB();
        const user = await User
            .findOne({id: userId});
            // .populate({
            //     path: 'communities',
            //     model: Community;
            // }));
        return user;
    } catch (error: any) {
        throw new Error(`Failed to fetch user ${error.message}`);
    }
}

export async function fetchUserPosts(userId: string) {
    try {
      connectToDB();
  
      // Find all threads by the user with the given userId
      const threads = await User.findOne({ id: userId })
      .populate({
        path: "threads",
        model: Thread,
        populate: [
        //   {
        //     path: "community",
        //     model: Community,
        //     select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        //   },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "name image id", // Select the "name" and "_id" fields from the "User" model
            },
          },
        ],
      });
      return threads;
    } catch (error: any) {
      console.error("Error fetching user threads:", error);
      throw error;
    }
  }