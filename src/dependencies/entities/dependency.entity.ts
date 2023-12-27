import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Movile } from 'src/moviles/entities/movile.entity';

@Entity()
export class Dependency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @OneToMany(() => Movile, (movile) => movile.dependency)
  movile: Movile;
}
