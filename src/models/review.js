import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  rating: {
    type:Number,
    min:1,
    max:5,
    required:true,
    default:1
  },
  comment: String,

},{timestamps: true });
reviewSchema.plugin(mongoosePaginate);
const Review = mongoose.model('Review', reviewSchema);

 export default Review;
 