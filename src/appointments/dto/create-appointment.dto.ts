import { IsString, IsEmail, IsDateString, IsOptional, IsUUID, Length, Matches } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  doctorId: string;

  @IsString()
  @Length(2, 100)
  patientFirstName: string;

  @IsString()
  @Length(2, 100)
  patientLastName: string;

  @IsEmail()
  patientEmail: string;

  @IsString()
  @Length(10, 20)
  patientPhone: string;

  @IsDateString()
  appointmentDate: string; // Format: '2024-01-15'

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'startTime must be in HH:MM format' })
  startTime: string; // Format: '09:00'

  @IsOptional()
  @IsString()
  notes?: string;
} 