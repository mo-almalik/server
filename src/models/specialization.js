import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
const specializationSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  
  },{timestamps:true});
  
  specializationSchema.plugin(mongoosePaginate);
  const Specialization = mongoose.model('Specialization', specializationSchema);
  
  export default Specialization
  