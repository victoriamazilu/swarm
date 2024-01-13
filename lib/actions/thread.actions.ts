"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
    text: string,
    author: string;
    communityId: string | null,
    path: string;
}

export async function createThread({
    text,
    author,
    communityId,
    path,
}: Params) {

    try {
        connectToDB();

        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        });

        //update user model
        await User.findByIdAndUpdate(author, {
            $push: {threads: createdThread._id},
        });

        //revalidate path, so that the page is updated
        revalidatePath(path);

    } catch (error: any) { 
        throw new Error(`Failed to create thread ${error.message}`);    
    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();

    //calculate the number of posts to skip depending on the page number
    const skipAmount = (pageNumber - 1) * pageSize;

    //fetch the posts that have no parents (none of the comments)
    const postsQuery = Thread.find({parentId: { $in: [null, undefined]}})
        .sort({createdAt: 'desc'})
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: 'author', model: User}) //populate the creator
        .populate({ path: 'children',  //populate the children
            populate: { path: 'author', model: User, select: "_id name parentId image"}
        })

    //find total number of posts to figure out amount of pages --but only count the ones that are not comments
    const totalPostsCount = await Thread.countDocuments({parentId: { $in: [null, undefined]},
    });

    const posts = await postsQuery.exec(); //execute the query

    const isNext = totalPostsCount > (skipAmount + posts.length); //check if we need a next page

    return { posts, isNext };
}