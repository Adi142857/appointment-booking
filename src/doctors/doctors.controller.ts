import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorResponseDto } from './dto/doctor-response.dto';
import { DoctorSpecialization } from './entities/doctor.entity';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<DoctorResponseDto> {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  async findAll(
    @Query('specialization') specialization?: DoctorSpecialization,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    
    return this.doctorsService.findAll(specialization, search, pageNum, limitNum);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DoctorResponseDto> {
    return this.doctorsService.findOne(id);
  }

  @Get(':id/available-slots')
  async getAvailableTimeSlots(
    @Param('id') id: string,
    @Query('date') date: string,
  ) {
    if (!date) {
      throw new Error('Date parameter is required');
    }
    
    return this.doctorsService.getAvailableTimeSlots(id, date);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: Partial<CreateDoctorDto>,
  ): Promise<DoctorResponseDto> {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.doctorsService.remove(id);
  }
} 