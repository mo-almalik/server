import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { sendMail } from "../../emails/sendEmail.js";
import { AppError, catchError } from "../../utils/error.handler.js";  
import Doctor from '../../models/doctor.js'
import {emailHtml} from '../../emails/emailTemplate.js'
import { v2 as cloudinary } from "cloudinary";

// export const verify = catchError(async (req, res) => {
//     jwt.verify(req.params.token, 'c11bc2262de686c' ,{expiresIn :'2h'}, async (err, decoded) => {
//         if (err) return res.json(err)
//         await Doctor.findOneAndUpdate({ email: decoded.email }, { verifyEmail: true })
//         res.json({ message: "تم تاكيد البريد" })
//     })
  
// })


export const DoctorRegister =  catchError(async (req,res)=>{
    const {email,phone,password ,name} = req.body
    if (req.file) {
     
      const Image = await cloudinary.uploader.upload(req.file.path, {
        folder: "Doctors",
        
      });
    }else{
      return res.status(400).json( "يرجى تحميل  الصور الشخصية " );
    }
     

    



	const checkPhone = await Doctor.findOne({ phone })
	if (checkPhone) throw new AppError('This phone is already taken', 400)
   const hashed = bcrypt.hashSync(password , +process.env.SALT)
			await Doctor.create({
                profilePhoto:{
                    name: Image.asset_id,
                    path: Image.secure_url,
                    public_id: Image.public_id,
                },
                name,
                email,
                phone,
                password:hashed
            })
              

			 res.json({ message:'success'})
		
})


