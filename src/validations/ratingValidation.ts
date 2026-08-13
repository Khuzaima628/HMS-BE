import joi from 'joi';

export const ratingValidation = joi.object({
  patientId: joi.string().required().messages({
    'string.base': 'Patient ID must be a string',
    'string.empty': 'Patient ID is required',
  }),
  doctorId: joi.string().required().messages({
    'string.base': 'Doctor ID must be a string',
    'string.empty': 'Doctor ID is required',
  }),
  appointmentId: joi.string().required().messages({
    'string.base': 'Appointment ID must be a string',
    'string.empty': 'Appointment ID is required',
  }),
  rating: joi.number().min(1).max(5).required().messages({
    'number.base': 'Rating must be a number',
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating must be at most 5',
    'number.empty': 'Rating is required',
  }),
  comment: joi.string().max(200).required().messages({
    'string.base': 'Comment must be a string',
    'string.max': 'Comment must be at most 200 characters',
    'string.empty': 'Comment is required',
  }),
});
