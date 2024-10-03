import { Router } from "express";
import {DoctorReview, addreview, DoctorReviewToUser ,getAllReview, deleteReview} from "../controllers/review.controller.js";
import { authenticate, authorize } from "../../auth/auth.middlewares.js";
import Role from "../../../utils/enum.js";
import { validate } from "../../../middlewares/validation.middleware.js";
import {addreviewSchema, IdReviewedSchema} from "../validations/vlaidate.review.js";



const router = Router()

router.post('/add/:doctorId',authenticate,authorize(Role.USER),validate(addreviewSchema),addreview)
router.get('/' ,authenticate,authorize(Role.DOCTOR),DoctorReview)
router.get('/admin' ,authenticate,authorize(Role.ADMIN),getAllReview)
router.get('/:id',validate(IdReviewedSchema),DoctorReviewToUser)
router.delete('/:id',authenticate,authorize(Role.ADMIN),validate(IdReviewedSchema),deleteReview)

export default router