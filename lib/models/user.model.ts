import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    image: {type: String},
    bio: {type: String},
    // one user can have multiple references to specific threads
    threads: [
        {   type: mongoose.Schema.Types.ObjectId, 
            ref: "Thread"
        }
    ],
    onboarded: {
        type: Boolean,
        default: false,
    },
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community"
        }
    ]
});

//for the first time, we need to create a model, everytime after that we just need to get the model
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;