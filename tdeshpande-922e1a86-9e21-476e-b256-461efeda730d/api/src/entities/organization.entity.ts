import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Organization, org => org.children, { nullable: true })
  parent: Organization;

  @OneToMany(() => Organization, org => org.parent)
  children: Organization[];

  @OneToMany(() => User, user => user.organization)
  users: User[];

  @OneToMany(() => Task, task => task.organization)
  tasks: Task[];
}