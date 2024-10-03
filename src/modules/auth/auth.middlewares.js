import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { AppError, catchError }  from '../../utils/error.handler.js'



export const authenticate = (req, res, next) => {
	const token = req.cookies.token
 
	if (!token)
		throw new AppError('Unauthorized', 401)
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET ,{expiresIn : process.env.JWT_EXPIRES_IN})
		req.user = decoded
		next()
	} catch (error) {
		throw new AppError(error.message, 498)
	}
}

export const authorize = (role) => {
	return (req, res, next) => {
		if (role !== req.user.role) throw new AppError('Forbidden', 403)
		next()
	}
}

export const assertUniqueEmail  = (model) => catchError(async (req, res, next) => {
	const { email } = req.body
	const user = await model.findOne({ email })
	if (user) throw new AppError('الايميل مستخدم بالفعل', 400)
	next()
})


export const Registrt =  (model) =>catchError(async (req,res)=>{
	const {name,email,phone,password} = req.body
	const checkPhone = await model.findOne({ phone })
	if (checkPhone) throw new AppError('This phone is already taken', 400)
		const hashed = bcrypt.hashSync(password , +process.env.SALT)
			const user = await model.create({
			name,
			email,
			phone,
			password :hashed
			})
			// let token = jwt.sign({ email: req.body.email }, 'text')
			// sendMail({email ,  html: emailHtml(token)})
			return res.json({user})
})

export const Login = (model)=> catchError(async(req,res)=>{
    const {email,password}= req.body
    const user = await model.findOne({email})
    if(!user || !bcrypt.compareSync(password ,user.password )) throw new AppError("البيانات غير صحيحة" , 404)
	if(user.isBlobk=== true) throw new AppError("المستخدم محظور تواصل مع الدعم الفني  " , 400)

	
	const { role, _id: id ,name} = user
	const token = jwt.sign({role, id ,name}, process.env.JWT_SECRET ,{expiresIn : process.env.JWT_EXPIRES_IN})
	res.cookie('token', token,{
		maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
		httpOnly: true,
        secure: process.env.MODE === 'production', // only use secure cookies in production environment
		sameSite: "Strict"
	})
	return res.json({success:true , data:{user,token ,role} })
	
})