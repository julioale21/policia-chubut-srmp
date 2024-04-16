import { EquipementIngress } from 'src/equipement-ingress/entities/equipement-ingress.entity';
import { Movil } from 'src/moviles/entities/movil.entity';
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

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
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

  @Column({ nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Movil, (movil) => movil.ingress)
  @JoinColumn()
  movil: Movil;

  @OneToMany(
    () => EquipementIngress,
    (equipementIngress) => equipementIngress.ingress,
    { cascade: ['insert', 'update', 'remove'], onDelete: 'CASCADE' },
  )
  equipementIngress: EquipementIngress[];
}
