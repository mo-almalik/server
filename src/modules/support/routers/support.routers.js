import { Router } from "express";
import { 
    createSupportSchema, 
    updateStatusSchema, 
    addReplySchema, 
    getSupportTicketByIdSchema, 
    deleteSupportTicketSchema, 
    updateReplySchema, 
    getAllSupportTicketsSchema
  } from "../validations/support.validations.js";
  import {validate} from '../../../middlewares/validation.middleware.js'
import { addReplyToTicket, createSupportTicket, deleteSupportTicket, getAllSupportTickets, getSupportTicketById, updateReplyInTicket, updateSupportTicketStatus } from "../controllers/support.controllers.js";
import { authenticate, authorize } from "../../auth/auth.middlewares.js";
import Role from "../../../utils/enum.js";



const router = Router()

router.post("/",authenticate,authorize(Role.DOCTOR), validate(createSupportSchema), createSupportTicket);
router.get("/",authenticate,authorize(Role.ADMIN), validate(getAllSupportTicketsSchema), getAllSupportTickets);
router.patch("/:id/status",authenticate,authorize(Role.ADMIN), validate(updateStatusSchema), updateSupportTicketStatus);
router.post("/:id/replies",authenticate,authorize(Role.ADMIN), validate(addReplySchema), addReplyToTicket);
router.post("/:id/doctor/replies",authenticate,authorize(Role.DOCTOR), validate(addReplySchema), addReplyToTicket);
router.get("/:id",authenticate,authorize(Role.ADMIN), validate(getSupportTicketByIdSchema), getSupportTicketById);
router.get("doctor/:id",authenticate,authorize(Role.DOCTOR), validate(getSupportTicketByIdSchema), getSupportTicketById);
router.delete("/:id",authenticate,authorize(Role.ADMIN), validate(deleteSupportTicketSchema), deleteSupportTicket);
router.patch("/:ticketId/replies/:replyId",authenticate,authorize(Role.ADMIN), validate(updateReplySchema), updateReplyInTicket);
// router.post("/:id/doctor/replies",authenticate,authorize(Role.DOCTOR), validate(addReplySchema), addReplyToTicket);

export default router