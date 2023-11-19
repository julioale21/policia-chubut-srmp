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
export class Ingress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  date: Date;

  @Column('numeric', {
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

  @Column('int', {
    nullable: false,
  })
  fuel_level: number;

  @ManyToOne(() => Movile, (movile) => movile.ingress)
  @JoinColumn()
  movile: Movile;

  @OneToOne(() => Equipement, (equipement) => equipement.ingress)
  @JoinColumn()
  equipement: Equipement;
}
