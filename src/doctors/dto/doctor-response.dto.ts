import { DoctorSpecialization } from '../entities/doctor.entity';

export class DoctorResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: DoctorSpecialization;
  bio?: string;
  imageUrl?: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
  appointmentDuration: number;
  createdAt: Date;
  updatedAt: Date;
} 