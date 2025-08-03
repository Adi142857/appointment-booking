import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor, DoctorSpecialization } from '../doctors/entities/doctor.entity';
import { Appointment, AppointmentStatus } from '../appointments/entities/appointment.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async seed(): Promise<void> {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await this.appointmentRepository.clear();
    await this.doctorRepository.clear();

    // Create sample doctors
    const doctors = await this.createDoctors();
    console.log(`✅ Created ${doctors.length} doctors`);

    // Create sample appointments
    const appointments = await this.createAppointments(doctors);
    console.log(`✅ Created ${appointments.length} appointments`);

    console.log('🎉 Database seeding completed!');
  }

  private async createDoctors(): Promise<Doctor[]> {
    const doctorsData = [
      {
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@hospital.com',
        phone: '+1-555-0101',
        specialization: DoctorSpecialization.CARDIOLOGY,
        bio: 'Experienced cardiologist with 15 years of practice in interventional cardiology.',
        imageUrl: 'https://example.com/doctor1.jpg',
        startTime: '09:00',
        endTime: '17:00',
        appointmentDuration: 30,
      },
      {
        firstName: 'Dr. Michael',
        lastName: 'Chen',
        email: 'michael.chen@hospital.com',
        phone: '+1-555-0102',
        specialization: DoctorSpecialization.DERMATOLOGY,
        bio: 'Board-certified dermatologist specializing in skin cancer detection and treatment.',
        imageUrl: 'https://example.com/doctor2.jpg',
        startTime: '08:00',
        endTime: '16:00',
        appointmentDuration: 45,
      },
      {
        firstName: 'Dr. Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@hospital.com',
        phone: '+1-555-0103',
        specialization: DoctorSpecialization.PEDIATRICS,
        bio: 'Pediatrician with a gentle approach to children\'s healthcare.',
        imageUrl: 'https://example.com/doctor3.jpg',
        startTime: '10:00',
        endTime: '18:00',
        appointmentDuration: 30,
      },
      {
        firstName: 'Dr. James',
        lastName: 'Wilson',
        email: 'james.wilson@hospital.com',
        phone: '+1-555-0104',
        specialization: DoctorSpecialization.ORTHOPEDICS,
        bio: 'Orthopedic surgeon specializing in sports injuries and joint replacement.',
        imageUrl: 'https://example.com/doctor4.jpg',
        startTime: '07:00',
        endTime: '15:00',
        appointmentDuration: 60,
      },
      {
        firstName: 'Dr. Lisa',
        lastName: 'Thompson',
        email: 'lisa.thompson@hospital.com',
        phone: '+1-555-0105',
        specialization: DoctorSpecialization.PSYCHIATRY,
        bio: 'Psychiatrist with expertise in anxiety, depression, and mood disorders.',
        imageUrl: 'https://example.com/doctor5.jpg',
        startTime: '09:00',
        endTime: '17:00',
        appointmentDuration: 50,
      },
    ];

    const doctors = doctorsData.map(data => this.doctorRepository.create(data));
    return await this.doctorRepository.save(doctors);
  }

  private async createAppointments(doctors: Doctor[]): Promise<Appointment[]> {
    const appointmentsData = [
      // Appointments for Dr. Sarah Johnson (Cardiology)
      {
        doctorId: doctors[0].id,
        patientFirstName: 'John',
        patientLastName: 'Smith',
        patientEmail: 'john.smith@email.com',
        patientPhone: '+1-555-0201',
        appointmentDate: new Date('2024-01-15'),
        startTime: '10:00',
        endTime: '10:30',
        status: AppointmentStatus.CONFIRMED,
        notes: 'Follow-up appointment for heart condition',
      },
      {
        doctorId: doctors[0].id,
        patientFirstName: 'Mary',
        patientLastName: 'Davis',
        patientEmail: 'mary.davis@email.com',
        patientPhone: '+1-555-0202',
        appointmentDate: new Date('2024-01-15'),
        startTime: '14:00',
        endTime: '14:30',
        status: AppointmentStatus.SCHEDULED,
        notes: 'Initial consultation',
      },
      // Appointments for Dr. Michael Chen (Dermatology)
      {
        doctorId: doctors[1].id,
        patientFirstName: 'Robert',
        patientLastName: 'Brown',
        patientEmail: 'robert.brown@email.com',
        patientPhone: '+1-555-0203',
        appointmentDate: new Date('2024-01-16'),
        startTime: '09:00',
        endTime: '09:45',
        status: AppointmentStatus.SCHEDULED,
        notes: 'Skin check appointment',
      },
      // Appointments for Dr. Emily Rodriguez (Pediatrics)
      {
        doctorId: doctors[2].id,
        patientFirstName: 'Jennifer',
        patientLastName: 'Garcia',
        patientEmail: 'jennifer.garcia@email.com',
        patientPhone: '+1-555-0204',
        appointmentDate: new Date('2024-01-17'),
        startTime: '11:00',
        endTime: '11:30',
        status: AppointmentStatus.CONFIRMED,
        notes: 'Well-child checkup for 5-year-old',
      },
    ];

    const appointments = appointmentsData.map(data => this.appointmentRepository.create(data));
    return await this.appointmentRepository.save(appointments);
  }
} 