import { Router } from "express";
import authRouter from "../modules/auth/auth.router.js"
import timeRouter from "../modules/time/routers/time.router.js"
import userRouter  from "../modules/user/routers/user.router.js"
import adminRouter from "../modules/admin/routers/admin.router.js"
import doctorRouter from "../modules/doctor/routers/doctor.router.js"
import reviewRouter  from "../modules/review/routers/review.router.js"
import analyticsRouter from "../modules/analytics/routers/analytics.routers.js"
import appointmentRouter from "../modules/appointment/routers/appointment.router.js"
import specialtiesRouter from  "../modules/specialization/routes/specialization.routers.js"
import politicsRouter from "../modules/politics/routers/politics.routers.js"
import supportRouter from "../modules/support/routers/support.routers.js"
const router = Router()

router.use('/times',timeRouter)
router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/admin', adminRouter)
router.use('/doctors',doctorRouter)
router.use('/review', reviewRouter)
router.use('/analytics',analyticsRouter)
router.use('/appointments',appointmentRouter)
router.use('/specialties',specialtiesRouter)
router.use('/politics',politicsRouter)
router.use('/support',supportRouter)

export default router