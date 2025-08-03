import { IsString, IsEmail, IsEnum, IsOptional, IsBoolean, IsInt, Min, Max, Length, Matches } from 'class-validator';
import { DoctorSpecialization } from '../entities/doctor.entity';

export class CreateDoctorDto {
  @IsString()
  @Length(2, 100)
  firstName: string;

  @IsString()
  @Length(2, 100)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(10, 20)
  phone: string;

  @IsEnum(DoctorSpecialization)
  specialization: DoctorSpecialization;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'startTime must be in HH:MM format' })
  startTime: string; // Format: '09:00'

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'endTime must be in HH:MM format' })
  endTime: string; // Format: '17:00'

  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(120)
  appointmentDuration?: number; // in minutes
} 