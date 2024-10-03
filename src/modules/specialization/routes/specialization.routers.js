import { Router } from "express";
import { addSpecialty, deleteSpecialty, getAllSpecialties, updateSpecialty } from "../controllers/specialization.controllers.js";
import { authenticate, authorize } from "../../auth/auth.middlewares.js";
import Role from "../../../utils/enum.js";
import { validate } from "../../../middlewares/validation.middleware.js";
import { addSpecialtySchema, deleteSpecialtySchema, updateSpecialtySchema } from "../validations/specialization.validations.js";


const router = Router();


router.route('/')
.get(getAllSpecialties)
.post(authenticate,authorize(Role.ADMIN),validate(addSpecialtySchema),addSpecialty)

router.route('/:id')
.put(authenticate,authorize(Role.ADMIN),validate(updateSpecialtySchema),updateSpecialty)
.delete(authenticate,authorize(Role.ADMIN),validate(deleteSpecialtySchema),deleteSpecialty)

export default router