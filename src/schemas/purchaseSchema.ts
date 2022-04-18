import Joi from 'joi';

const purchaseSchema = Joi.object({
  password: Joi.string().regex(/^[0-9]{4}$/).required(),
  businessId: Joi.number().required(),
  amount: Joi.number().min(1).required()
})

export default purchaseSchema;