import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);

    return await this.roleRepository.save(role);
  }

  async findAll() {
    return await this.roleRepository.find();
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOneBy({ id });

    if (!role) {
      throw new NotFoundException(`Role #${id} not found`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOneBy({ id });

    if (!role) {
      throw new NotFoundException(`Role #${id} not found`);
    }

    Object.assign(role, updateRoleDto);

    return await this.roleRepository.save(role);
  }

  async remove(id: string) {
    const role = await this.roleRepository.findOneBy({ id });

    if (!role) {
      throw new NotFoundException(`Role #${id} not found`);
    }

    await this.roleRepository.remove(role);

    return `Role #${id} removed`;
  }
}
