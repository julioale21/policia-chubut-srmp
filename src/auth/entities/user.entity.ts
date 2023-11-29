import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true, nullable: false })
  name: string;

  @Column('text', { unique: true, nullable: false })
  email: string;

  @Column('text', { array: true, nullable: false })
  roles: string[];
}
