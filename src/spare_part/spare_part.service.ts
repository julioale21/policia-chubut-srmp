import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSparePartDto } from './dto/create-spare_part.dto';
import { UpdateSparePartDto } from './dto/update-spare_part.dto';
import { Repository } from 'typeorm';
import { SparePart } from './entities/spare_part.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SparePartService {
  constructor(
    @InjectRepository(SparePart)
    private sparePartRepository: Repository<SparePart>,
  ) {}

  async create(createSparePartDto: CreateSparePartDto) {
    try {
      const sparePart = this.sparePartRepository.create(createSparePartDto);
      await this.sparePartRepository.save(sparePart);
      return sparePart;
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('spare part code already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    return await this.sparePartRepository.find();
  }

  async findOne(id: string) {
    const sparePart = await this.sparePartRepository.findOneBy({ id });

    if (!sparePart) {
      throw new NotFoundException(`SparePart #${id} not found`);
    }

    return sparePart;
  }

  async update(id: string, updateSparePartDto: UpdateSparePartDto) {
    const sparePart = await this.sparePartRepository.findOneBy({ id });

    if (!sparePart) {
      throw new NotFoundException(`SparePart #${id} not found`);
    }

    this.sparePartRepository.merge(sparePart, updateSparePartDto);
    return this.sparePartRepository.save(sparePart);
  }

  async remove(id: string) {
    const sparePart = await this.sparePartRepository.findOneBy({ id });

    if (!sparePart) {
      throw new NotFoundException(`SparePart #${id} not found`);
    }

    await this.sparePartRepository.remove(sparePart);

    return `SparePart #${id} deleted`;
  }
}
