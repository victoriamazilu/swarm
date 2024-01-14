"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Buzz from "../models/buzz.model";
import Community from "../models/community.model";
import mongoose from "mongoose";

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level buzzes) (a buzz that is not a comment/reply).
  const postsQuery = Buzz.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  // Count the total number of top-level posts (buzzes) i.e., buzzes that are not comments.
  const totalPostsCount = await Buzz.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

export async function createBuzz({ text, author, communityId, path }: Params
) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdBuzz = await Buzz.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { buzzes: createdBuzz._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { buzzes: createdBuzz._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create buzz: ${error.message}`);
  }
}

async function fetchAllChildBuzzes(buzzId: string): Promise<any[]> {
  const childBuzzes = await Buzz.find({ parentId: buzzId });

  const descendantBuzzes = [];
  for (const childBuzz of childBuzzes) {
    const descendants = await fetchAllChildBuzzes(childBuzz._id);
    descendantBuzzes.push(childBuzz, ...descendants);
  }

  return descendantBuzzes;
}

export async function deleteBuzz(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the buzz to be deleted (the main buzz)
    const mainBuzz = await Buzz.findById(id).populate("author community");

    if (!mainBuzz) {
      throw new Error("Buzz not found");
    }

    // Fetch all child buzzes and their descendants recursively
    const descendantBuzzes = await fetchAllChildBuzzes(id);

    // Get all descendant buzz IDs including the main buzz ID and child buzz IDs
    const descendantBuzzIds = [
      id,
      ...descendantBuzzes.map((buzz) => buzz._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantBuzzes.map((buzz) => buzz.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainBuzz.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantBuzzes.map((buzz) => buzz.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainBuzz.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child buzzes and their descendants
    await Buzz.deleteMany({ _id: { $in: descendantBuzzIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { buzzes: { $in: descendantBuzzIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { buzzes: { $in: descendantBuzzIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete buzz: ${error.message}`);
  }
}

export async function fetchBuzzById(buzzId: string) {
  connectToDB();

  try {
    const buzz = await Buzz.findById(buzzId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Buzz, // The model of the nested children (assuming it's the same "Buzz" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return buzz;
  } catch (err) {
    console.error("Error while fetching buzz:", err);
    throw new Error("Unable to fetch buzz");
  }
}

export async function addCommentToBuzz(
  buzzId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original buzz by its ID
    const originalBuzz = await Buzz.findById(buzzId);

    if (!originalBuzz) {
      throw new Error("Buzz not found");
    }

    // Create the new comment buzz
    const commentBuzz = new Buzz({
      text: commentText,
      // author: new mongoose.Types.ObjectId(userId),
      author: userId,
      parentId: buzzId, // Set the parentId to the original buzz's ID
    });

    // Save the comment buzz to the database
    const savedCommentBuzz = await commentBuzz.save();

    // Add the comment buzz's ID to the original buzz's children array
    originalBuzz.children.push(savedCommentBuzz._id);

    // Save the updated original buzz to the database
    await originalBuzz.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}
