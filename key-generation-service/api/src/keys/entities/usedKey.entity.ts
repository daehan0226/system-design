import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UsedKey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 4,
    unique: true,
  })
  key: string;
}
