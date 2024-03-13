import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  thumbnail: string;

  @Column()
  seats: number;

  @Column()
  price: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @ManyToMany(() => User)
  @JoinTable()
  registeredUsers: User[];
}
