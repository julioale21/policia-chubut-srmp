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
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Movile {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column('varchar', { unique: true, nullable: false })
  @Field(() => String, { nullable: false })
  domain: string;

  @Column('varchar', { nullable: false })
  @Field(() => String, { nullable: false })
  brand: string;

  @Column('varchar', { nullable: false })
  @Field(() => String, { nullable: false })
  model: string;

  @OneToOne(() => Dependency)
  @JoinColumn()
  dependency: Dependency;

  @OneToMany(() => Ingress, (ingress) => ingress.movile)
  @Field(() => [Ingress], { nullable: true })
  ingress: Ingress[];
}
