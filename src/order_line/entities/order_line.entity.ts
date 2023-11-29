import { SparePart } from 'src/spare_part/entities/spare_part.entity';
import { SparePartOrder } from 'src/spare_part_order/entities/spare_part_order.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float', { default: 0 })
  quantity: number;

  @ManyToOne(() => SparePartOrder)
  sparePartOrder: SparePartOrder;

  @ManyToOne(() => SparePart)
  sparePart: SparePart;
}
