import { Ingress } from 'src/ingress/entities/ingress.entity';
import { Mechanic } from 'src/mechanics/entities/mechanic.entity';
import { Movil } from 'src/moviles/entities/movil.entity';
import { SparePartOrder } from 'src/spare_part_order/entities/spare_part_order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Egress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ nullable: true })
  observations: string;

  @Column({ unique: true })
  order_number: string;

  @ManyToOne(() => Mechanic)
  mechanic_boss: Mechanic;

  @ManyToOne(() => Mechanic)
  mechanic: Mechanic;

  @ManyToOne(() => Movil)
  movil: Movil;

  @OneToOne(() => Ingress, (ingress) => ingress.egress)
  @JoinColumn()
  ingress: Ingress;

  @OneToOne(() => SparePartOrder, (sparare_part) => sparare_part.egress)
  @JoinColumn()
  spare_part_order: SparePartOrder;

  @Column({ nullable: true })
  deletedAt: Date | null;
}
