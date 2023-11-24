import { IsDate, IsOptional, IsString } from 'class-validator';
import { Mechanic } from 'src/mechanics/entities/mechanic.entity';
import { Movile } from 'src/moviles/entities/movile.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Egress {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @IsDate()
  @IsOptional()
  date: Date;

  @Column()
  @IsOptional()
  @IsString()
  observations: string;

  @ManyToOne(() => Mechanic)
  mechanic_boss: Mechanic;

  @ManyToOne(() => Mechanic)
  mechanic: Mechanic;

  @ManyToOne(() => Movile)
  movile: Movile;
}
