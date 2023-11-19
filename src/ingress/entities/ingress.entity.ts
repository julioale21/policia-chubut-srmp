import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Equipement } from 'src/equipements/entities/equipement.entity';
import { Movile } from 'src/moviles/entities/movile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Ingress {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Date)
  @Column('date')
  date: Date;

  @Field(() => Int)
  @Column('numeric', {
    nullable: false,
  })
  kilometers: number;

  @Field(() => String, {
    nullable: true,
    description: 'Descripcion de reparacion',
  })
  @Column('varchar', {
    nullable: false,
  })
  repair_description: string;

  @Field(() => String)
  @Column('varchar', {
    nullable: false,
  })
  order_number: string;

  @Field(() => Int)
  @Column('int', {
    nullable: false,
  })
  fuel_level: number;

  @Field(() => Movile)
  @ManyToOne(() => Movile, (movile) => movile.ingress)
  @JoinColumn()
  movile: Movile;

  @Field(() => Equipement, { nullable: true })
  @OneToOne(() => Equipement, (equipement) => equipement.ingress)
  @JoinColumn()
  equipement: Equipement;
}
