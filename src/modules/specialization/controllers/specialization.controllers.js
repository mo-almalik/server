import Specialization from "../../../models/specialization.js";
import { AppError, catchError } from "../../../utils/error.handler.js";


const addSpecialty =  catchError(async (req,res)=>{
    const { name, } = req.body;
    if (!name) throw new AppError("يجب ادخال اسم التخصص", 400);
    const checkSpecialty = await Specialization.findOne({ name });
    if (checkSpecialty) throw new AppError("التخصص موجود مسبقا", 400);
    const specialty = await Specialization.create({ name});
    res.status(201).json({data:specialty});
 
})

const getAllSpecialties = catchError(async (req,res)=>{
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    //   populate: "time",
    };
  
    const specialties = await Specialization.paginate({},options);
    res.json({data:specialties});
})


const updateSpecialty = catchError(async (req,res)=>{
    const { id } = req.params;
    const { name } = req.body;
    const specialty = await Specialization.findByIdAndUpdate(id, { name }, { new: true });
    if(!specialty) throw new AppError('التخصص غير موجود',404)
    res.json({data:specialty});
})

const deleteSpecialty = catchError(async (req,res)=>{
    const { id } = req.params;
    const specialty = await Specialization.findByIdAndDelete(id);
    if(!specialty) throw new AppError('التخصص غير موجود',404)
    res.json({success:true, message:"تم الحذف بنجاح"});
})

export {
    addSpecialty,
    getAllSpecialties,
    updateSpecialty,
    deleteSpecialty,
 
}