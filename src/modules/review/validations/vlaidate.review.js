import Joi from "joi";
export const addreviewSchema = Joi.object({
        body:{
            rating: Joi.number().min(1).max(5).required(),
            comment: Joi.string().trim()
        },
        params: {doctorId :Joi.string().hex().length(24).required()},
        query: {},
})
export const IdReviewedSchema = Joi.object({
    params: {id :Joi.string().hex().length(24).required()},
    query: {
        page:Joi.number()
    },
    body:{}
})