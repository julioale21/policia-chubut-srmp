import { Provider } from 'src/provider/entities/provider.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SparePartOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  order_number: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('text')
  observations: string;

  @Column({ type: 'text' })
  type: string;

  @ManyToOne(() => Provider)
  provider: Provider;
}
