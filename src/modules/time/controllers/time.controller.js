import Time from "../../../models/time.js"
import { AppError, catchError } from "../../../utils/error.handler.js"


const addtime = catchError(async(req,res)=>{
    const {id} =req.user
    const {startTime ,endTime ,day} = req.body
    const checked = await Time.findOne({doctorId:id ,day})
    if(checked) throw new AppError("تم اضافة اليوم  مسبقا" , 400)
      const data = await Time.create({
        doctorId:id,
        startTime,
        endTime,
        day
    })
    res.json({success:true,message:"تم اضافة الوقت بنجاح" ,data})
    
})

const getDays = catchError(async (req,res)=>{
    const {id} =req.params 

    let data = await Time.findOne({doctorId:id})
    if(!data)throw new AppError('لاتوجد مواعيد متاحة' ,404)
  data = await Time.find({doctorId:id ,isAvailable :true})


 res.json({data})

})


const getDoctorTime = catchError(async (req,res)=>{
    const {id}= req.user
   
    let data = await Time.find({doctorId:id})
   
    if(!data)throw new AppError('لاتوجد مواعيد متاحة' ,404)
    res.json({data})
   
   })
   
   const mangeTime = catchError(async (req,res)=>{
    const {doctorId}= req.user.id
   const {id} =req.params
    let data = await Time.findById({_id :id , doctorId})
   
   if(data){
    await Time.findByIdAndUpdate(id,{
        startTime:req.body.startTime,
        endTime:req.body.endTime,
    })
   return res.json({success:true ,message :"تم التعديل " })
   }
   
   throw new AppError('لم يتم العثور علي الموعد' ,404)
   })

   const deleteTime = catchError(async (req,res)=>{
    const {doctorId}= req.user.id
   const {id} =req.params
    let data = await Time.findById({_id:id,doctorId})
   if(data){
    await Time.findByIdAndDelete({_id:id})
   return res.json({success:true ,message :"تم الحذف بنجاح "})
   }
   
   throw new AppError('لم يتم العثور علي الموعد' ,404)
   })

   const timeStatus = catchError(async (req,res)=>{
    const {doctorId}= req.user.id
    const {id} =req.params
    let data = await Time.findById({_id:id,doctorId})
    if(data){
    await Time.findByIdAndUpdate(id,{isAvailable:!data.isAvailable})
    return res.json({success:true ,message :"تم التعديل " })
    }
    throw new AppError('لم يتم العثور علي الموعد' ,404)

   })


export{
    addtime,
    getDays,
    getDoctorTime,
    mangeTime,
    deleteTime,
    timeStatus
 
}