import { Field, ObjectType } from '@nestjs/graphql';
import { Ingress } from 'src/ingress/entities/ingress.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Equipement {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id: string;

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  @Field(() => Boolean, { description: 'Crique', nullable: true })
  car_jack: boolean; //crique

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  @Field(() => Boolean, { description: 'Llave de rueda' })
  weel_wrench: boolean; // llave de rueda

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  @Field(() => Boolean, { description: 'Matafuego' })
  fire_stinguisher: boolean; // extintor

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  @Field(() => Boolean, { description: 'Chaleco Reflectivo' })
  reflective_vest: boolean; // chaleco reflectivo

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  @Field(() => Boolean, { description: 'Balizas' })
  beacons: boolean; // balizas

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  @Field(() => Boolean, { description: 'Equipo de comunicaciones' })
  communication_equipment: boolean; // equipo de comunicacion

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  @Field(() => Boolean, { description: 'Antena de radio' })
  radio_antenna: boolean; // antena de radio

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  @Field(() => Boolean, { description: 'Radio Estero' })
  stereo: boolean; // estereo

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  @Field(() => Boolean, { description: 'Linea para remolcar' })
  trailer_line: boolean; // linea de trailer

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  @Field(() => Boolean, { description: 'Rueda de auxilio' })
  spare_wheel: boolean; // rueda de repuesto

  @Column('text', {
    nullable: true,
  })
  @Field(() => String, { description: 'Observaciones', nullable: true })
  observations: string;

  @OneToOne(() => Ingress)
  @JoinColumn()
  @Field(() => Ingress, { nullable: true })
  ingress: Ingress;
}
