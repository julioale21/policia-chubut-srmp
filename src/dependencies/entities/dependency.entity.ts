import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dependency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  description: string;
}
