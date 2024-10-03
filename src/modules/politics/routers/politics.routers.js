import { Router } from "express";
import { authenticate, authorize } from "../../auth/auth.middlewares.js";
import Role from '../../../utils/enum.js'
import {validate} from "../../../middlewares/validation.middleware.js"
import { addPoliticsSchema ,updatePoliticsSchema ,deletePoliticsSchema } from "../validations/politics.validations.js";
import { addPolitics, deletePolitics, getPolitics, updatePolitics ,getToAdmin} from "../controllers/politics.controllers.js";

const router = Router()

router.get('/admin',(authenticate,authorize(Role.ADMIN),getToAdmin));

router.route('/')
.post(authenticate,authorize(Role.ADMIN),validate(addPoliticsSchema),addPolitics)
.get(getPolitics)
router.route('/:id')
 .put(authenticate,authorize(Role.ADMIN),validate(updatePoliticsSchema),updatePolitics)
 .delete(authenticate,authorize(Role.ADMIN),validate(deletePoliticsSchema),deletePolitics)
export default router