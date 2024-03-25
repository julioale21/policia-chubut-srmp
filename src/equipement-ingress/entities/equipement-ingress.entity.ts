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

  @ManyToOne(() => Equipement, (equipement) => equipement.equipementIngress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  equipement: Equipement;

  @ManyToOne(() => Ingress, (ingress) => ingress.equipementIngress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  ingress: Ingress;
}
