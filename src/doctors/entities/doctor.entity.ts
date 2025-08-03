import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';

export enum DoctorSpecialization {
  CARDIOLOGY = 'cardiology',
  DERMATOLOGY = 'dermatology',
  NEUROLOGY = 'neurology',
  ORTHOPEDICS = 'orthopedics',
  PEDIATRICS = 'pediatrics',
  PSYCHIATRY = 'psychiatry',
  SURGERY = 'surgery',
  INTERNAL_MEDICINE = 'internal_medicine',
}

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  specialization: DoctorSpecialization;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'time' })
  startTime: string; // Format: '09:00'

  @Column({ type: 'time' })
  endTime: string; // Format: '17:00'

  @Column({ type: 'int', default: 30 })
  appointmentDuration: number; // in minutes

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments: Appointment[];

  // Virtual property for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
} 