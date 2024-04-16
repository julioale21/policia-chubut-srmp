import { MovilesService } from './../moviles/moviles.service';
import { Injectable } from '@nestjs/common';
import { DependenciesService } from 'src/dependencies/dependencies.service';
import { EquipementsService } from 'src/equipements/equipements.service';
import { initialData } from './data/seed-data';
import { Movile } from 'src/moviles/entities/movile.entity';
import { Dependency } from 'src/dependencies/entities/dependency.entity';
import { IngressService } from 'src/ingress/ingress.service';
import { Equipement } from 'src/equipements/entities/equipement.entity';
import { EquipementIngressService } from 'src/equipement-ingress/equipement-ingress.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly equipementsService: EquipementsService,
    private readonly dependenciesService: DependenciesService,
    private readonly movilesService: MovilesService,
    private readonly ingressService: IngressService,
    private readonly equipementIngressService: EquipementIngressService,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const dependencies = await this.createDependencies();
    const equipements = await this.createEquipements();
    const moviles = await this.createMoviles(dependencies);
    await this.createIngresses(moviles, equipements);

    return {
      message: 'Seed executed successfully',
    };
  }

  private async deleteTables() {
    await this.equipementIngressService.deleteAllEquipementIngresses();
    await this.ingressService.deleteAllIngresses();
    await this.equipementsService.deleteAllEquipements();
    await this.movilesService.deleteAllMoviles();
    await this.dependenciesService.deleteAllDependencies();
  }

  private async createDependencies() {
    const createdDependencies = [];
    const mockDependencies = initialData.dependencies;

    for (const dependency of mockDependencies) {
      const newDependency = await this.dependenciesService.create(dependency);
      createdDependencies.push(newDependency);
    }

    return createdDependencies;
  }

  private async createEquipements() {
    const createdEquipements = [];
    const mockEquipements = initialData.equipements;

    for (const equipement of mockEquipements) {
      const newEquipement = await this.equipementsService.create(equipement);
      createdEquipements.push(newEquipement);
    }

    return createdEquipements;
  }

  private async createMoviles(dependencies: Dependency[]) {
    const createdMoviles = [];
    const mockMoviles = initialData.moviles;

    for (const movile of mockMoviles) {
      const randomIndex = Math.floor(Math.random() * dependencies.length);
      const selectedDependency = dependencies[randomIndex];

      const newMovile: Movile = await this.movilesService.create({
        ...(movile as Movile),
        dependencyId: selectedDependency.id,
      });

      createdMoviles.push(newMovile);
    }

    return createdMoviles;
  }

  private async createIngresses(moviles: Movile[], equipements: Equipement[]) {
    const createdIngresses = [];
    const mockIngresses = initialData.ingresses;

    for (const ingress of mockIngresses) {
      const randomMovileIndex = Math.floor(Math.random() * moviles.length);
      const selectedMovile = moviles[randomMovileIndex];
      const newIngress = await this.ingressService.create({
        ...ingress,
        movile_id: selectedMovile.id,
        equipements: equipements.map((equipement) => equipement.id),
      });
      createdIngresses.push(newIngress);
    }

    return createdIngresses;
  }
}
