import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mechanic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  surname: string;
}
