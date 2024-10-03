import mongoosePaginate from "mongoose-paginate-v2";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const supportSchema = new Schema({
  ticketNumber: {
    type: String,
    unique: true,
    // required: true,
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Resolved", "Closed"],
    default: "Open",
  },
  
  replies: [
    {
      sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      sentAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
},{timestamps: true});

supportSchema.pre("save", async function (next) {
  if (!this.ticketNumber) {
    this.ticketNumber = Math.floor(100000 + Math.random() * 900000).toString();
  }
  next();
});

supportSchema.plugin(mongoosePaginate);

const Support = mongoose.model("Support", supportSchema);

export default Support;
