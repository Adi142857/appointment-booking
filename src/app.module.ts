import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { Doctor } from './doctors/entities/doctor.entity';
import { Appointment } from './appointments/entities/appointment.entity';

@Module({
  imports: [
    // Configuration module for environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Database connection
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Doctor, Appointment],
      synchronize: process.env.NODE_ENV !== 'production', // Auto-create tables in development
      logging: process.env.NODE_ENV !== 'production',
    }),
    
    // Feature modules
    DoctorsModule,
    AppointmentsModule
  ],
})
export class AppModule {} 