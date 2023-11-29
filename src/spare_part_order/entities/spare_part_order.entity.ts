import { OrderLine } from 'src/order_line/entities/order_line.entity';
import { Provider } from 'src/provider/entities/provider.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
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

  @ManyToOne(() => Provider)
  provider: Provider;

  @OneToMany(() => OrderLine, (orderLine) => orderLine.sparePartOrder, {
    cascade: true,
  })
  orderLine: OrderLine;
}
