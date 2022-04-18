import Joi from 'joi';

const rechargeSchema = Joi.object({
  amount: Joi.number().min(1).required()
})

export default rechargeSchema;