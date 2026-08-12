import joi from "joi"
import {Status} from "@src/models/appointmentModel"

export const createAppointmentSchema = joi.object({
    doctor: joi.string().required().messages({
        "any.required": "Doctor is required",
    }),
    date: joi.date().required().messages({
        "any.required": "Date is required",
    }),
    time: joi.string().required().messages({
        "any.required": "Time is required",
    }),
    status: joi.string().valid(...Object.values(Status)).default(Status.Pending).messages({
        "any.default": "Default status is pending",
    }),
    notes: joi.string().required().messages({
        "any.required": "Notes is required",
    }),
});
