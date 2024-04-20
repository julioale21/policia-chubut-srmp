import { Egress } from 'src/egress/entities/egress.entity';
import { EquipementIngress } from 'src/equipement-ingress/entities/equipement-ingress.entity';
import { Movil } from 'src/moviles/entities/movil.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IngressPriority, IngressStatus } from '../dto/create-ingress.dto';

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

  @ManyToOne(() => Movil, (movil) => movil.ingress)
  @JoinColumn()
  movil: Movil;

  @OneToOne(() => Egress, (egress) => egress.ingress, { cascade: true })
  egress: Egress;

  @OneToMany(
    () => EquipementIngress,
    (equipementIngress) => equipementIngress.ingress,
    { cascade: ['insert', 'update', 'remove'], onDelete: 'CASCADE' },
  )
  equipementIngress: EquipementIngress[];

  @Column({ nullable: true })
  deletedAt: Date | null;

  @Column({
    type: 'enum',
    enum: IngressPriority,
    default: IngressPriority.Low,
  })
  priority: IngressPriority;

  @Column({
    type: 'enum',
    enum: IngressStatus,
    default: IngressStatus.Pending,
  })
  status: IngressStatus;
}
