import { EquipementIngress } from 'src/equipement-ingress/entities/equipement-ingress.entity';
import { Movile } from 'src/moviles/entities/movile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @OneToMany(
    () => EquipementIngress,
    (equipementIngress) => equipementIngress.ingress,
  )
  equipementIngress: EquipementIngress;
}
