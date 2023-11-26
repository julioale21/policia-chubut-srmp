import { SparePartOrder } from 'src/spare_part_order/entities/spare_part_order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @OneToMany(() => SparePartOrder, (sparePartOrder) => sparePartOrder.provider)
  sparePartOrder: SparePartOrder;
}
