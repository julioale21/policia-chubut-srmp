import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Dependency } from 'src/dependencies/entities/dependency.entity';
import { Ingress } from 'src/ingress/entities/ingress.entity';
import { Egress } from 'src/egress/entities/egress.entity';

@Entity()
export class Movile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true, nullable: false })
  internal_register: string;

  @Column('varchar', { unique: true, nullable: false })
  domain: string;

  @Column('varchar', { nullable: false })
  brand: string;

  @Column('varchar', { nullable: false })
  model: string;

  @ManyToOne(() => Dependency)
  @JoinColumn()
  dependency: Dependency;

  @OneToMany(() => Ingress, (ingress) => ingress.movile)
  ingress: Ingress[];

  @OneToMany(() => Egress, (egress) => egress.movile)
  egress: Egress;
}
