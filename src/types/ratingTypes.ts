

interface RatingBody {
    appointmentId: string;
    patientId: string;
    doctorId: string;
    rating: number;
    comment?: string;
}

export type { RatingBody };
