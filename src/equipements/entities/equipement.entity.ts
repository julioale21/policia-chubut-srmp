import { EquipementIngress } from 'src/equipement-ingress/entities/equipement-ingress.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Equipement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  type: string;

  @OneToMany(
    () => EquipementIngress,
    (equipementIngress) => equipementIngress.equipement,
    { cascade: ['insert', 'update', 'remove'], onDelete: 'CASCADE' },
  )
  equipementIngress: EquipementIngress[];
}
