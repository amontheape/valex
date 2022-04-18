import Joi from 'joi';

const activationSchema = Joi.object({
  CVV: Joi.string().regex(/^[0-9]{3}$/).required(),
  password: Joi.string().regex(/^[0-9]{4}$/).required()
})

export default activationSchema;