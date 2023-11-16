import { Ingress } from 'src/ingress/entities/ingress.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Equipement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  car_jack: boolean; //crique

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  weel_wrench: boolean; // llave de rueda

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  fire_stinguisher: boolean; // extintor

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  reflective_vest: boolean; // chaleco reflectivo

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  beacons: boolean; // balizas

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  communication_equipment: boolean; // equipo de comunicacion

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  radio_antenna: boolean; // antena de radio

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  stereo: boolean; // estereo

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  trailer_line: boolean; // linea de trailer

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  spare_wheel: boolean; // rueda de repuesto

  @Column('text', {
    nullable: true,
  })
  observations: string;

  @OneToOne(() => Ingress)
  @JoinColumn()
  ingress: Ingress;
}
