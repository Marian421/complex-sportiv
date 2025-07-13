const Joi = require('joi');

const getAvailabilityParams = Joi.object({
  fieldId: Joi.number().integer().required()
});

const getAvailabilityQuery = Joi.object({
  date: Joi.string().required()
});

const bookSlotParams = Joi.object({
  fieldId: Joi.number().integer().required(),
  slot_id: Joi.number().integer().required()
});

const bookSlotQuery = Joi.object({
  date: Joi.string().required()
});

const cancelReservationParams = Joi.object({
  reservationId: Joi.number().integer().required()
});

module.exports = {
  getAvailabilityParams,
  getAvailabilityQuery,
  bookSlotParams,
  bookSlotQuery,
  cancelReservationParams
};
