import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateEquipementDto } from './dto/create-equipement.dto';
// import { UpdateEquipementDto } from './dto/update-equipement.dto';
import { Equipement } from './entities/equipement.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateEquipementDto } from './dto/update-equipement.dto';

@Injectable()
export class EquipementsService {
  constructor(
    @InjectRepository(Equipement)
    private readonly equipementRepository: Repository<Equipement>,
  ) {}

  async create(createEquipementDto: CreateEquipementDto) {
    try {
      const equipement = this.equipementRepository.create(createEquipementDto);
      await this.equipementRepository.save(equipement);
      return equipement;
    } catch (error) {
      if (
        error.message.includes('duplicate key value violates unique constraint')
      ) {
        throw new UnprocessableEntityException('Equipement already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    return await this.equipementRepository.find();
  }

  async findOne(id: string): Promise<Equipement> {
    const equipement = await this.equipementRepository.findOne({
      where: { id },
    });

    if (!equipement) throw new NotFoundException('Equipement not found');

    return equipement;
  }

  async update(id: string, updateEquipementDto: UpdateEquipementDto) {
    const equipement = await this.equipementRepository.findOne({
      where: { id },
    });

    if (!equipement) throw new NotFoundException('Equipement not found');

    const updatedEquipement = await this.equipementRepository.save({
      ...equipement,
      ...updateEquipementDto,
    });

    return updatedEquipement;
  }

  async remove(id: string) {
    const equipement = await this.equipementRepository.findOne({
      where: { id },
    });

    if (!equipement) throw new NotFoundException('Equipement not found');
    await this.equipementRepository.delete(equipement.id);

    return 'Equipement deleted';
  }

  async deleteAllEquipements() {
    const query = this.equipementRepository.createQueryBuilder('equipement');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
