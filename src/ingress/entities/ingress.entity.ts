import { Equipement } from 'src/equipements/entities/equipement.entity';
import { Movile } from 'src/moviles/entities/movile.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Ingress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  date: Date;

  @Column('varchar', {
    length: 50,
    nullable: false,
  })
  kilometers: number;

  @Column('varchar', {
    nullable: false,
  })
  repair_description: string;

  @Column('varchar', {
    nullable: false,
  })
  order_number: string;

  @Column('varchar', {
    nullable: false,
  })
  fuel_level: number;

  @ManyToOne(() => Movile, (movile) => movile.ingress)
  movile: Movile;

  @OneToOne(() => Equipement, (equipement) => equipement.ingress)
  equipement: Equipement;
}
