import Joi from "joi";

// Schema for creating a new support ticket
export const createSupportSchema = Joi.object({
  body: Joi.object({
    subject: Joi.string().min(3).max(100).required().label("Subject"),
    message: Joi.string().min(10).max(1000).required().label("Message"),
  }),
  params:{},
  query: {},
});

// Schema for updating support ticket status
export const updateStatusSchema = Joi.object({
  body: Joi.object({
    status: Joi.string()
      .valid("Open", "In Progress", "Resolved", "Closed")
      .required()
      .label("Status"),
  }),
  params:{},
  query: {},
});

// Schema for adding a reply to a ticket
export const addReplySchema = Joi.object({
  body: Joi.object({
    message: Joi.string().min(5).max(1000).required().label("Message"),
  }),
  params:{
    id: Joi.string().hex().length(24).required().label("Ticket ID"),
  },
  query: {},
});

// Schema for fetching a single support ticket by ID
export const getSupportTicketByIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().hex().length(24).required().label("Ticket ID"),
  }),
  body:{},
  query: {},
});

// Schema for deleting a support ticket
export const deleteSupportTicketSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().hex().length(24).required().label("Ticket ID"),
  }),
  body:{},
  query: {},
});

// Schema for updating a reply in a ticket
export const updateReplySchema = Joi.object({
  params: Joi.object({
    ticketId: Joi.string().hex().length(24).required().label("Ticket ID"),
    replyId: Joi.string().hex().length(24).required().label("Reply ID"),
  }),
  body: Joi.object({
    message: Joi.string().min(5).max(1000).required().label("Message"),
  }),
  query: {},
});


// Schema for getting all support tickets with pagination and filters
export const getAllSupportTicketsSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).optional().label("Page"),
    limit: Joi.number().integer().min(1).optional().label("Limit"),
    status: Joi.string()
      .valid("Open", "In Progress", "Resolved", "Closed")
      .optional()
      .label("Status"),
    
  }),
  params: {},
  body: {},
});
