import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Movil } from 'src/moviles/entities/movil.entity';

@Entity()
export class Dependency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @OneToMany(() => Movil, (movile) => movile.dependency)
  movil: Movil;
}
