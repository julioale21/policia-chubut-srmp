import { Equipement } from 'src/equipements/entities/equipement.entity';
import { Ingress } from 'src/ingress/entities/ingress.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['equipement', 'ingress'])
export class EquipementIngress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Equipement)
  @JoinColumn()
  equipement: Equipement;

  @ManyToOne(() => Ingress)
  @JoinColumn()
  ingress: Ingress;
}
