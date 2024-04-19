import { Egress } from 'src/egress/entities/egress.entity';
import { OrderLine } from 'src/order_line/entities/order_line.entity';
import { Provider } from 'src/provider/entities/provider.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SparePartOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  order_number: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('text')
  observations: string;

  @Column({ type: 'text' })
  type: string;

  @OneToOne(() => Egress, (egress) => egress.spare_part_order, {
    cascade: true,
  })
  egress: Egress;

  @ManyToOne(() => Provider)
  provider: Provider;

  @OneToMany(() => OrderLine, (orderLine) => orderLine.sparePartOrder, {
    cascade: ['insert', 'update', 'remove'],
  })
  orderLines: OrderLine[];
}
