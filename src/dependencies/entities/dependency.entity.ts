import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dependency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  description: string;
}
