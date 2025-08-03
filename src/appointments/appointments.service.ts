import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly doctorsService: DoctorsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Validate doctor exists
    const doctor = await this.doctorsService.findOne(createAppointmentDto.doctorId);
    
    // Parse appointment date and time
    const appointmentDate = new Date(createAppointmentDto.appointmentDate);
    const startTime = createAppointmentDto.startTime;
    
    // Calculate end time based on doctor's appointment duration
    const startDateTime = new Date(`2000-01-01T${startTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + (doctor.appointmentDuration * 60000));
    const endTime = endDateTime.toTimeString().slice(0, 5);

    // Check if appointment date is in the past
    const now = new Date();
    const appointmentDateTime = new Date(`${createAppointmentDto.appointmentDate}T${startTime}:00`);
    if (appointmentDateTime <= now) {
      throw new BadRequestException('Cannot book appointments in the past');
    }

    // Check if appointment date is on a weekend
    const dayOfWeek = appointmentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      throw new BadRequestException('Cannot book appointments on weekends');
    }

    // Check if appointment time is within doctor's working hours
    if (startTime < doctor.startTime || startTime >= doctor.endTime) {
      throw new BadRequestException('Appointment time must be within doctor\'s working hours');
    }

    // Check for overlapping appointments
    const hasOverlap = await this.checkForOverlappingAppointments(
      createAppointmentDto.doctorId,
      appointmentDate,
      startTime,
      endTime,
    );

    if (hasOverlap) {
      throw new ConflictException('This time slot is already booked');
    }

    // Create the appointment
    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      appointmentDate,
      startTime,
      endTime,
      status: AppointmentStatus.SCHEDULED,
    });

    return await this.appointmentRepository.save(appointment);
  }

  async findAll(
    doctorId?: string,
    patientEmail?: string,
    status?: AppointmentStatus,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ appointments: Appointment[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.appointmentRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor');

    // Add filters
    if (doctorId) {
      queryBuilder.andWhere('appointment.doctorId = :doctorId', { doctorId });
    }

    if (patientEmail) {
      queryBuilder.andWhere('appointment.patientEmail = :patientEmail', { patientEmail });
    }

    if (status) {
      queryBuilder.andWhere('appointment.status = :status', { status });
    }

    // Add pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Add ordering
    queryBuilder.orderBy('appointment.appointmentDate', 'DESC')
      .addOrderBy('appointment.startTime', 'ASC');

    const [appointments, total] = await queryBuilder.getManyAndCount();

    return {
      appointments,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async updateStatus(id: string, status: AppointmentStatus, cancellationReason?: string): Promise<Appointment> {
    const appointment = await this.findOne(id);

    // Validate status transition
    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot modify a completed appointment');
    }

    if (status === AppointmentStatus.CANCELLED && !cancellationReason) {
      throw new BadRequestException('Cancellation reason is required when cancelling an appointment');
    }

    // Update appointment
    appointment.status = status;
    if (cancellationReason) {
      appointment.cancellationReason = cancellationReason;
    }

    return await this.appointmentRepository.save(appointment);
  }

  async remove(id: string): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
  }

  private async checkForOverlappingAppointments(
    doctorId: string,
    appointmentDate: Date,
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    const overlappingAppointments = await this.appointmentRepository.find({
      where: {
        doctorId,
        appointmentDate,
        status: Between(AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED),
      },
    });

    // Check for time overlap
    return overlappingAppointments.some(appointment => {
      const existingStart = appointment.startTime;
      const existingEnd = appointment.endTime;

      // Check if the new appointment overlaps with existing ones
      return (
        (startTime >= existingStart && startTime < existingEnd) || // New start time falls within existing appointment
        (endTime > existingStart && endTime <= existingEnd) || // New end time falls within existing appointment
        (startTime <= existingStart && endTime >= existingEnd) // New appointment completely encompasses existing appointment
      );
    });
  }
} 