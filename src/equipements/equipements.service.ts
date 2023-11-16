import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipementDto } from './dto/create-equipement.dto';
// import { UpdateEquipementDto } from './dto/update-equipement.dto';
import { Equipement } from './entities/equipement.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EquipementsService {
  constructor(
    @InjectRepository(Equipement)
    private readonly equipementRepository: Repository<Equipement>,
  ) {}

  async create(createEquipementDto: CreateEquipementDto) {
    const equipement = this.equipementRepository.create(createEquipementDto);

    return await this.equipementRepository.save(equipement);
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

  // update(id: string, updateEquipementDto: UpdateEquipementDto) {
  //   return `This action updates a #${id} equipement`;
  // }

  // remove(id: string) {
  //   return `This action removes a #${id} equipement`;
  // }
}
