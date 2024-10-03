import Joi from "joi";


const addSpecialtySchema = Joi.object({
    body:{
        name: Joi.string().required(),
    },
    params: {},
    query: {},
 });

const updateSpecialtySchema = Joi.object({
    body:{
        name: Joi.string()
    },
    params:{
        id: Joi.string().hex().length(24).required()
    },
    query: {},

})

const deleteSpecialtySchema = Joi.object({
    body:{},
    params:{
        id: Joi.string().hex().length(24).required()
    },
    query: {},
})

export {
    addSpecialtySchema,
    updateSpecialtySchema,
    deleteSpecialtySchema,
 
}