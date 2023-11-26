import { Mechanic } from 'src/mechanics/entities/mechanic.entity';
import { Movile } from 'src/moviles/entities/movile.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => Movile)
  movile: Movile;
}
