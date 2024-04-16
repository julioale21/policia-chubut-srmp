import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async create(createProviderDto: CreateProviderDto) {
    try {
      const provider = this.providerRepository.create(createProviderDto);

      return await this.providerRepository.save(provider);
    } catch (error) {
      console.error(error);
      if (error.message.includes('duplicate key value violates unique')) {
        throw new NotFoundException('Provider already exists');
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    return await this.providerRepository.find();
  }

  async findOne(id: string) {
    const provider = await this.providerRepository.findOneBy({ id: id });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }

  async update(id: string, updateProviderDto: UpdateProviderDto) {
    const provider = await this.providerRepository.findOneBy({ id: id });

    Object.assign(provider, updateProviderDto);
    return this.providerRepository.save(provider);
  }

  async remove(id: string) {
    const provider = await this.providerRepository.findOneBy({ id: id });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    await this.providerRepository.remove(provider);
    return `Deleted provider with id: ${id}`;
  }

  async deleteAllProviders() {
    await this.providerRepository.clear();
    return 'All providers deleted';
  }
}
