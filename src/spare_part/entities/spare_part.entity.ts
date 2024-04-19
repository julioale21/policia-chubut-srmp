import { OrderLine } from 'src/order_line/entities/order_line.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SparePart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  brand: string;

  @Column('text', { unique: true })
  model: string;

  @Column('text')
  description: string;

  @Column('text', { array: true })
  compatibility_vehicle: string[];

  @Column('float', { default: 0 })
  stock: number;

  @OneToMany(() => OrderLine, (orderLine) => orderLine.sparePart, {
    cascade: true,
  })
  orderLine: OrderLine;
}
