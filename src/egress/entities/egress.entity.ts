import { Ingress } from 'src/ingress/entities/ingress.entity';
import { Mechanic } from 'src/mechanics/entities/mechanic.entity';
import { Movil } from 'src/moviles/entities/movil.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Egress {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column()
  observations: string;

  @ManyToOne(() => Mechanic)
  mechanic_boss: Mechanic;

  @ManyToOne(() => Mechanic)
  mechanic: Mechanic;

  @ManyToOne(() => Movil)
  movil: Movil;

  @OneToOne(() => Ingress)
  ingress: Ingress;
}
