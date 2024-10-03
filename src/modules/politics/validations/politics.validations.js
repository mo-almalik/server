import Joi from "joi";

const addPoliticsSchema = Joi.object({
    body: {
        title: Joi.string().required(),
        content: Joi.string().required(),
    },
    params: {},
    query: {},
}) 

const updatePoliticsSchema = Joi.object({
    body: {
        title: Joi.string(),
        content: Joi.string(),
        status: Joi.string().valid("active", "inactive"),
    },
    params: {
        id: Joi.string().hex().length(24).required(),
    },
    query: {},
})


const deletePoliticsSchema = Joi.object({
    params: {
        id: Joi.string().hex().length(24).required(),
    },
    query: {},
    body: {},
})

export {
    addPoliticsSchema,
    updatePoliticsSchema,
    deletePoliticsSchema,
}