import mongoose from "mongoose";

const politicsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
},{timestamps: true})


const Politics = mongoose.model('Politice' ,politicsSchema)
export default Politics