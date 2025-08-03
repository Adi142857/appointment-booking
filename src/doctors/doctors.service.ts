import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Doctor, DoctorSpecialization } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorResponseDto } from './dto/doctor-response.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<DoctorResponseDto> {
    // Check if email already exists
    const existingDoctor = await this.doctorRepository.findOne({
      where: { email: createDoctorDto.email },
    });

    if (existingDoctor) {
      throw new BadRequestException('Doctor with this email already exists');
    }

    // Validate time range
    if (createDoctorDto.startTime >= createDoctorDto.endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    const doctor = this.doctorRepository.create(createDoctorDto);
    const savedDoctor = await this.doctorRepository.save(doctor);
    
    return this.mapToResponseDto(savedDoctor);
  }

  async findAll(
    specialization?: DoctorSpecialization,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ doctors: DoctorResponseDto[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.doctorRepository.createQueryBuilder('doctor');

    // Add filters
    if (specialization) {
      queryBuilder.andWhere('doctor.specialization = :specialization', { specialization });
    }

    if (search) {
      queryBuilder.andWhere(
        '(doctor.firstName ILIKE :search OR doctor.lastName ILIKE :search OR doctor.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Add pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Add ordering
    queryBuilder.orderBy('doctor.createdAt', 'DESC');

    const [doctors, total] = await queryBuilder.getManyAndCount();

    return {
      doctors: doctors.map(doctor => this.mapToResponseDto(doctor)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<DoctorResponseDto> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['appointments'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    return this.mapToResponseDto(doctor);
  }

  async update(id: string, updateDoctorDto: Partial<CreateDoctorDto>): Promise<DoctorResponseDto> {
    const doctor = await this.findOne(id);

    // Check if email is being updated and if it already exists
    if (updateDoctorDto.email && updateDoctorDto.email !== doctor.email) {
      const existingDoctor = await this.doctorRepository.findOne({
        where: { email: updateDoctorDto.email },
      });

      if (existingDoctor) {
        throw new BadRequestException('Doctor with this email already exists');
      }
    }

    // Validate time range if both times are provided
    if (updateDoctorDto.startTime && updateDoctorDto.endTime) {
      if (updateDoctorDto.startTime >= updateDoctorDto.endTime) {
        throw new BadRequestException('Start time must be before end time');
      }
    }

    await this.doctorRepository.update(id, updateDoctorDto);
    const updatedDoctor = await this.findOne(id);
    
    return updatedDoctor;
  }

  async remove(id: string): Promise<void> {
    const doctor = await this.doctorRepository.findOne({ where: { id } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    await this.doctorRepository.remove(doctor);
  }

  async getAvailableTimeSlots(
    doctorId: string,
    date: string,
  ): Promise<{ time: string; available: boolean }[]> {
    const doctor = await this.findOne(doctorId);
    
    // Parse the date
    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.getDay();
    
    // Check if it's a weekend (0 = Sunday, 6 = Saturday)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return []; // No appointments on weekends
    }

    // Get existing appointments for this doctor on this date
    const existingAppointments = await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.appointments', 'appointment')
      .where('doctor.id = :doctorId', { doctorId })
      .andWhere('appointment.appointmentDate = :date', { date })
      .andWhere('appointment.status NOT IN (:...cancelledStatuses)', {
        cancelledStatuses: ['cancelled', 'no_show'],
      })
      .getOne();

    const bookedSlots = existingAppointments?.appointments || [];

    // Generate time slots
    const slots: { time: string; available: boolean }[] = [];
    const startTime = new Date(`2000-01-01T${doctor.startTime}:00`);
    const endTime = new Date(`2000-01-01T${doctor.endTime}:00`);
    const duration = doctor.appointmentDuration;

    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const timeString = currentTime.toTimeString().slice(0, 5);
      
      // Check if this slot is booked
      const isBooked = bookedSlots.some(appointment => 
        appointment.startTime === timeString
      );

      slots.push({
        time: timeString,
        available: !isBooked,
      });

      // Move to next slot
      currentTime.setMinutes(currentTime.getMinutes() + duration);
    }

    return slots;
  }

  private mapToResponseDto(doctor: Doctor): DoctorResponseDto {
    return {
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      fullName: doctor.fullName,
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.specialization,
      bio: doctor.bio,
      imageUrl: doctor.imageUrl,
      isActive: doctor.isActive,
      startTime: doctor.startTime,
      endTime: doctor.endTime,
      appointmentDuration: doctor.appointmentDuration,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    };
  }
} 