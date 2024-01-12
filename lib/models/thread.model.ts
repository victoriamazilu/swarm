import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
    text: {type: String, required: true},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    parent: {
        type: String,
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread', //one thread can have multiple children of other threads (comments)
        }
    ],
});

//for the first time, we need to create a model, everytime after that we just need to get the model
const Thread = mongoose.models.User || mongoose.model("Thread", threadSchema);

export default Thread;