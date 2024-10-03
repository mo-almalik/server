import { populate } from "dotenv";
import Support from "../../../models/support.js";
import { catchError} from "../../../utils/error.handler.js";

const createSupportTicket = catchError(async (req, res) => {
  const {  subject, message } = req.body;
  const newTicket = new Support({
    doctor:req.user.id,
    subject,
    message,
  });
  const savedTicket = await newTicket.save();
  res.status(201).json(savedTicket);
});



const getAllSupportTickets = catchError(async (req, res) => {
  const { page = 1, limit = 10, status, admin, doctor } = req.query;

  const filters = {};
  if (status) filters.status = status;
  if (admin) filters.admin = admin;
  if (doctor) filters.doctor = doctor;
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 }, 
    populate:({ path: 'doctor', select: 'email phone isBlock name' }),

  }
  const tickets = await Support.paginate(filters,options)

  res.status(200).json(tickets);
});



const getSupportTicketById = catchError(async (req, res) => {
  const { id } = req.params;
  const ticket = await Support.findById(id).populate(
    "admin doctor replies.sender"
  );
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }
  res.status(200).json(ticket);
});



const updateSupportTicketStatus = catchError(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const ticket = await Support.findById(id);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  ticket.status = status;
  ticket.updatedAt = Date.now();

  const updatedTicket = await ticket.save();
  res.status(200).json(updatedTicket);
});


const addReplyToTicket = catchError(async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  const ticket = await Support.findById(id);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }
  if (req.user.id !== ticket.doctor._id) {
    return res.status(400).json({ message: "Ticket not found" });
  }
  ticket.replies.push({ sender:req.user.id, message, sentAt: Date.now() });
  ticket.updatedAt = Date.now();

  const updatedTicket = await ticket.save();
  res.status(200).json(updatedTicket);
});



const deleteSupportTicket = catchError(async (req, res) => {
  const { id } = req.params;

  const ticket = await Support.findByIdAndDelete(id);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  res.status(200).json({ message: "Ticket deleted successfully" });
});



const getRepliesOfTicket = catchError(async (req, res) => {
  const { id } = req.params;

  const ticket = await Support.findById(id).populate("replies.sender");
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  res.status(200).json(ticket.replies);
});

const getSupportTicketsByDoctor = catchError(async (req, res) => {
  const doctorId = req.user.id;  

  const { page = 1, limit = 10, status } = req.query;
  

  const query = { doctor: doctorId };
  if (status) query.status = status;


  const tickets = await Support.paginate(query, {
    page,
    limit,
    populate:  "doctor",
    sort: { createdAt: -1 },
  });

  // Send the tickets in the response
  res.status(200).json(tickets);
});

const updateReplyInTicket = catchError(async (req, res) => {
  const { ticketId, replyId } = req.params;
  const { message } = req.body;

  const ticket = await Support.findById(ticketId);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  const reply = ticket.replies.id(replyId);
  if (!reply) {
    return res.status(404).json({ message: "Reply not found" });
  }

  reply.message = message;
  ticket.updatedAt = Date.now();

  const updatedTicket = await ticket.save();
  res.status(200).json(updatedTicket);
});


export{
    createSupportTicket,
    getAllSupportTickets,
    getSupportTicketById,
    updateSupportTicketStatus,
    addReplyToTicket,
    deleteSupportTicket,
    getRepliesOfTicket,
    updateReplyInTicket,
    getSupportTicketsByDoctor
 };

