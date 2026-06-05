import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    profilePic: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    lastSeen: {
        type: Date
    },
    isOnline: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


const User = mongoose.model("User", userSchema);

export default User;