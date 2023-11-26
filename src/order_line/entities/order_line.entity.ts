import { SparePartOrder } from 'src/spare_part_order/entities/spare_part_order.entity';
import {
  Column,
  Double,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class OrderLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('numeric', { default: 0 })
  quantity: Double;

  @ManyToOne(() => SparePartOrder)
  sparePartOrder: SparePartOrder;

  @ManyToOne(() => SparePartOrder)
  sparePart: SparePartOrder;
}
