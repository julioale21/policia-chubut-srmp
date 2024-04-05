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

  @ManyToOne(() => Equipement, (equipement) => equipement.equipementIngress)
  @JoinColumn()
  equipement: Equipement;

  @ManyToOne(() => Ingress, (ingress) => ingress.equipementIngress)
  @JoinColumn()
  ingress: Ingress;
}
