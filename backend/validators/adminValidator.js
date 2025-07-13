const Joi = require('joi');

const makeReservation = Joi.object({
  guest_name: Joi.string().min(3).max(50).required(),
  guest_phone: Joi.string()
    .pattern(/^(?:\+407|07)[0-9]{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid format of the phone number',
  }),
  fieldId: Joi.number().integer().required(),
  date: Joi.string().isoDate().required(),
  slotId: Joi.number().integer().required()
});

const seeReservationsQuery = Joi.object({
  fieldId: Joi.number().integer().required(),
  date: Joi.string().isoDate().required()
});

const deleteField = Joi.object({
  field_id: Joi.number().integer().required()
});

const addField = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('').required(),
  location: Joi.string().min(2).required(),
  price_per_hour: Joi.number().positive().required()
});

module.exports = {
  makeReservation,
  seeReservationsQuery,
  deleteField,
  addField
};
