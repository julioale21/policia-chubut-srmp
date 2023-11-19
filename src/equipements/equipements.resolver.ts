import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Equipement } from './entities/equipement.entity';
import { EquipementsService } from './equipements.service';
import { CreateEquipementDto } from './dto/create-equipement.dto';

@Resolver(() => Equipement)
export class EquipementsResolver {
  constructor(private readonly equipementsService: EquipementsService) {}
  @Query(() => [Equipement])
  async getAllEquipements() {
    const equipements = await this.equipementsService.findAll();
    return equipements;
  }

  @Mutation(() => Equipement)
  async createEquipement(
    @Args('createEquipementData') createEquipementDto: CreateEquipementDto,
  ) {
    const equipement =
      await this.equipementsService.create(createEquipementDto);

    return equipement;
  }
}
