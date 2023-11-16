import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Dependency } from 'src/dependencies/entities/dependency.entity';
import { Ingress } from 'src/ingress/entities/ingress.entity';

@Entity()
export class Movile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true, nullable: false })
  domain: string;

  @Column('varchar', { nullable: false })
  brand: string;

  @Column('varchar', { nullable: false })
  model: string;

  @OneToOne(() => Dependency)
  @JoinColumn()
  dependency: Dependency;

  @OneToMany(() => Ingress, (ingress) => ingress.movile)
  ingress: Ingress[];
}
