import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { UpdateMechanicDto } from './dto/update-mechanic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mechanic } from './entities/mechanic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MechanicsService {
  private readonly logger = new Logger('MechanicService');

  constructor(
    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,
  ) {}

  async create(createMechanicDto: CreateMechanicDto) {
    try {
      const mechanic = this.mechanicRepository.create(createMechanicDto);
      await this.mechanicRepository.save(mechanic);
      return mechanic;
    } catch (error) {
      console.error(error);
    }
  }

  async findAll() {
    return this.mechanicRepository.find();
  }

  async findOne(id: string) {
    const mechanic = await this.mechanicRepository.findOne({ where: { id } });
    if (!mechanic) {
      throw new NotFoundException(`Mechanic with id ${id} not found`);
    }
    return mechanic;
  }

  async update(id: string, updateMechanicDto: UpdateMechanicDto) {
    try {
      const mechanic = await this.mechanicRepository.findOne({ where: { id } });
      if (!mechanic) {
        throw new NotFoundException(`Mechanic with id ${id} not found`);
      }
      const updatedMechanic = Object.assign(mechanic, updateMechanicDto);
      return this.mechanicRepository.save(updatedMechanic);
    } catch (error) {
      console.error(error);
    }
  }

  async remove(id: string) {
    try {
      const mechanic = await this.mechanicRepository.find({ where: { id } });
      if (!mechanic) {
        throw new NotFoundException(`Mechanic with id ${id} not found`);
      }
      return this.mechanicRepository.remove(mechanic);
    } catch (error) {
      console.error(error);
    }
    return `This action removes a #${id} mechanic`;
  }

  async deleteAllMechanics() {
    const query = this.mechanicRepository.createQueryBuilder('mechanic');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
