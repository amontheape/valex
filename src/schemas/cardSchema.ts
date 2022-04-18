import Joi from 'joi';

const cardSchema = Joi.object({
  type: Joi.string().valid('education', 'groceries', 'health', 'restaurant', 'transport').required(),
  employeeId: Joi.number().required()
})

export default cardSchema;