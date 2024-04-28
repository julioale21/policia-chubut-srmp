import { MovilesService } from './../moviles/moviles.service';
import { Injectable } from '@nestjs/common';
import { DependenciesService } from 'src/dependencies/dependencies.service';
import { EquipementsService } from 'src/equipements/equipements.service';
import { initialData } from './data/seed-data';
import { Movil } from 'src/moviles/entities/movil.entity';
import { Dependency } from 'src/dependencies/entities/dependency.entity';
import { IngressService } from 'src/ingress/ingress.service';
import { Equipement } from 'src/equipements/entities/equipement.entity';
import { EquipementIngressService } from 'src/equipement-ingress/equipement-ingress.service';
import { MechanicsService } from 'src/mechanics/mechanics.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly equipementsService: EquipementsService,
    private readonly dependenciesService: DependenciesService,
    private readonly movilesService: MovilesService,
    private readonly ingressService: IngressService,
    private readonly equipementIngressService: EquipementIngressService,
    private readonly mechanicsService: MechanicsService,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const dependencies = await this.createDependencies();
    const equipements = await this.createEquipements();
    const moviles = await this.createMoviles(dependencies);
    await this.createIngresses(moviles, equipements);
    await this.createMechanics();

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
    await this.mechanicsService.deleteAllMechanics();
    // await this.providerService.deleteAllProviders();
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

    for (const movil of mockMoviles) {
      const randomIndex = Math.floor(Math.random() * dependencies.length);
      const selectedDependency = dependencies[randomIndex];

      const newMovil: Movil = await this.movilesService.create({
        ...(movil as Movil),
        dependencyId: selectedDependency.id,
      });

      createdMoviles.push(newMovil);
    }

    return createdMoviles;
  }

  private async createIngresses(moviles: Movil[], equipements: Equipement[]) {
    const createdIngresses = [];
    const mockIngresses = initialData.ingresses;

    for (const ingress of mockIngresses) {
      const randomMovileIndex = Math.floor(Math.random() * moviles.length);
      const selectedMovile = moviles[randomMovileIndex];
      const newIngress = await this.ingressService.create({
        ...ingress,
        movil_id: selectedMovile.id,
        equipements: equipements.map((equipement) => equipement.id),
      });
      createdIngresses.push(newIngress);
    }

    return createdIngresses;
  }

  private async createMechanics() {
    const createdMechanics = [];
    const mockMechanics = initialData.mechanics;

    for (const mechanic of mockMechanics) {
      const newMechanic = await this.mechanicsService.create(mechanic);
      createdMechanics.push(newMechanic);
    }
  }
}
