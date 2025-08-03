import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  doctorId: string;

  @Column({ type: 'varchar', length: 100 })
  patientFirstName: string;

  @Column({ type: 'varchar', length: 100 })
  patientLastName: string;

  @Column({ type: 'varchar', length: 255 })
  patientEmail: string;

  @Column({ type: 'varchar', length: 20 })
  patientPhone: string;

  @Column({ type: 'date' })
  appointmentDate: Date;

  @Column({ type: 'time' })
  startTime: string; // Format: '09:00'

  @Column({ type: 'time' })
  endTime: string; // Format: '09:30'

  @Column({
    type: 'varchar',
    length: 20,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Doctor, doctor => doctor.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  // Virtual property for patient full name
  get patientFullName(): string {
    return `${this.patientFirstName} ${this.patientLastName}`;
  }
} 