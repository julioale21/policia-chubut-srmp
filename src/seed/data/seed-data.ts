export interface SeedDependency {
  name: string;
}

export interface SeedEquipement {
  type: string;
}

export interface SeedMovile {
  internal_register: string;
  brand: string;
  model: string;
  domain: string;
}

export interface SeedIngress {
  date: Date;
  kilometers: number;
  repair_description: string;
  order_number: string;
  fuel_level: number;
}

interface SeedData {
  dependencies: SeedDependency[];
  equipements: SeedEquipement[];
  moviles: SeedMovile[];
  ingresses: SeedIngress[];
}

export const initialData: SeedData = {
  equipements: [
    {
      type: 'Rueda de auxilio',
    },
    {
      type: 'Matafuegos',
    },
    {
      type: 'Llave de ruedas',
    },
    {
      type: 'Balizas',
    },
    {
      type: 'Radio comunicaciones',
    },
    {
      type: 'Estereo',
    },
    {
      type: 'Crique',
    },
    {
      type: 'Kit primeros auxilios',
    },
  ],

  dependencies: [
    {
      name: 'Comisaria 1',
    },
    {
      name: 'Comisaria 2',
    },
    {
      name: 'Comisaria 3',
    },
    {
      name: 'Comisaria Mujer',
    },
    {
      name: 'Comunitaria',
    },
    {
      name: 'Infanteria',
    },
  ],

  moviles: [
    {
      brand: 'Volswagen',
      domain: 'ABC123',
      internal_register: '654321',
      model: 'Gol',
    },
    {
      brand: 'Volkswagen',
      domain: 'ABC124',
      internal_register: '654322',
      model: 'Gol',
    },
    {
      brand: 'Volkswagen',
      domain: 'ABC125',
      internal_register: '654323',
      model: 'Gol',
    },
    {
      brand: 'Volkswagen',
      domain: 'ABC126',
      internal_register: '654324',
      model: 'Gol',
    },
    {
      brand: 'Volkswagen',
      domain: 'ABC127',
      internal_register: '654325',
      model: 'Gol',
    },
    {
      brand: 'Volkswagen',
      domain: 'ABC128',
      internal_register: '654326',
      model: 'Gol',
    },
    {
      brand: 'Volkswagen',
      domain: 'ABC129',
      internal_register: '654327',
      model: 'Gol',
    },
    {
      brand: 'Volkswagen',
      domain: 'ABC130',
      internal_register: '654328',
      model: 'Gol',
    },
    {
      brand: 'Volkswagen',
      domain: 'ABC131',
      internal_register: '654329',
      model: 'Gol',
    },
    {
      brand: 'Volkswagen',
      domain: 'ABC132',
      internal_register: '654330',
      model: 'Gol',
    },
    {
      brand: 'Volkswagen',
      domain: 'ABC133',
      internal_register: '654331',
      model: 'Gol',
    },
    {
      brand: 'Volkswagen',
      domain: 'ABC134',
      internal_register: '654332',
      model: 'Gol',
    },
    {
      brand: 'Volkswagen',
      domain: 'ABC135',
      internal_register: '654333',
      model: 'Gol',
    },
  ],

  ingresses: [
    {
      date: new Date(),
      kilometers: 100000,
      repair_description: 'Cambio de aceite',
      order_number: '123456',
      fuel_level: 50,
    },
    {
      date: new Date(),
      kilometers: 50000,
      repair_description: 'Cambio de rotulas',
      order_number: '123457',
      fuel_level: 25,
    },
    {
      date: new Date(),
      kilometers: 120000,
      repair_description: 'Cambio de bieletas',
      order_number: '123458',
      fuel_level: 75,
    },
    {
      date: new Date(),
      kilometers: 200000,
      repair_description: 'Cambio de aceite',
      order_number: '123458',
      fuel_level: 100,
    },
    {
      date: new Date(),
      kilometers: 100000,
      repair_description: 'Cambio de frenos',
      order_number: '123459',
      fuel_level: 10,
    },
    {
      date: new Date(),
      kilometers: 50000,
      repair_description: 'Cambio de aceite',
      order_number: '123460',
      fuel_level: 30,
    },
    {
      date: new Date(),
      kilometers: 100000,
      repair_description: 'Cambio de rotulas',
      order_number: '123461',
      fuel_level: 75,
    },
    {
      date: new Date(),
      kilometers: 98000,
      repair_description: 'Cambio de aceite',
      order_number: '123462',
      fuel_level: 25,
    },
    {
      date: new Date(),
      kilometers: 80000,
      repair_description: 'Cambio de bieletas',
      order_number: '123463',
      fuel_level: 90,
    },
    {
      date: new Date(),
      kilometers: 125000,
      repair_description: 'Cambio parrilla',
      order_number: '123464',
      fuel_level: 50,
    },
    {
      date: new Date(),
      kilometers: 100000,
      repair_description: 'Cambio embrague',
      order_number: '123465',
      fuel_level: 80,
    },
    {
      date: new Date(),
      kilometers: 230000,
      repair_description: 'ruido motor',
      order_number: '123466',
      fuel_level: 100,
    },
    {
      date: new Date(),
      kilometers: 100000,
      repair_description: 'Reparacion de motor',
      order_number: '123467',
      fuel_level: 20,
    },
    {
      date: new Date(),
      kilometers: 60000,
      repair_description: 'Desperfecto en caja de cambios',
      order_number: '123468',
      fuel_level: 50,
    },
    {
      date: new Date(),
      kilometers: 100000,
      repair_description: 'Cambio de aceite',
      order_number: '123469',
      fuel_level: 25,
    },
    {
      date: new Date(),
      kilometers: 200000,
      repair_description: 'Cambio de aceite',
      order_number: '123470',
      fuel_level: 30,
    },
    {
      date: new Date(),
      kilometers: 150000,
      repair_description: 'Cambio frenos',
      order_number: '123471',
      fuel_level: 40,
    },
    {
      date: new Date(),
      kilometers: 120000,
      repair_description: 'Cambio de rulemanes',
      order_number: '123472',
      fuel_level: 60,
    },
    {
      date: new Date(),
      kilometers: 25000,
      repair_description: 'Control de aceite',
      order_number: '123473',
      fuel_level: 100,
    },
    {
      date: new Date(),
      kilometers: 180000,
      repair_description: 'Cambio cubiertas',
      order_number: '123474',
      fuel_level: 10,
    },
    {
      date: new Date(),
      kilometers: 190000,
      repair_description: 'Cambio de aceite',
      order_number: '123475',
      fuel_level: 50,
    },
    {
      date: new Date(),
      kilometers: 60000,
      repair_description: 'Cambio paragolpes',
      order_number: '123476',
      fuel_level: 40,
    },
    {
      date: new Date(),
      kilometers: 100000,
      repair_description: 'Cambio luneta',
      order_number: '123477',
      fuel_level: 100,
    },
  ],
};
