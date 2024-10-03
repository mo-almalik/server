import {catchError } from "../../../utils/error.handler.js";
import Review from "../../../models/review.js";
import Appointment from "../../../models/appointment.js";


const addreview = catchError(async(req,res)=>{
    const {doctorId} = req.params
   const {id} = req.user
   const checkUser = await Appointment.findOne({userId:id ,status:'confirmed'})

   if(!checkUser) return res.status(401).json({message : 'انت لاتمتلك حجز مع الدكتور ولايمكنك التقيم'})

    const {rating,comment} = req.body
    // const existingReview = await Review.findOne({ user: id, doctor: doctorId });
    // if(existingReview) throw new AppError('تم التقيم من قبل' , 406)
    const data = await Review.create({
        user:req.user.id,
        doctor:doctorId,
        rating,
        comment
    })
    res.json({data})
     
})

const DoctorReview = catchError(async(req,res)=>{

    const { page = 1, limit = 10 } = req.query;
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: ({path:"user" ,select: 'name'})
    };
    const {id : doctor} = req.user
    const review = await Review.paginate({doctor},options);
    return res.json({data:review})
  
  })

const DoctorReviewToUser = catchError(async(req,res)=>{

    const { page = 1, limit = 10 } = req.query;
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        select: "-user"

    };
    const {id} = req.params
    const review = await Review.paginate({doctor:id},options);
    return res.json({data:review})

})

const getAllReview = catchError(async (req,res)=>{
    const { page = 1, limit = 10 } = req.query;
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: ({path:"user doctor",select: 'name profilePhoto'})
    };
    const review = await Review.paginate({},options);
    return res.json({data:review})
})
const deleteReview = catchError(async (req,res)=>{
    const data = await Review.findOneAndDelete(req.params.id)
    if(!data) throw new AppError('التقيم غير موجود',404)
        return res.json({success:true, message:"تم الحذف بنجاح"})
})
export {
    addreview,
    DoctorReview,
    DoctorReviewToUser,
    getAllReview,
    deleteReview
}