import { Status } from "@src/models/appointmentModel";
import { Types } from "mongoose";

interface AppointmentBody {
  doctor: string;
  date: Date;
  time: string;
  status?: Status;
  notes: string;
}

export type { AppointmentBody };
