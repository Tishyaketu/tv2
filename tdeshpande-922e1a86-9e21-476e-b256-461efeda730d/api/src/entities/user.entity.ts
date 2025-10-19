import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from './organization.entity';
import { Task } from './task.entity';

export enum UserRole {
  OWNER = 'Owner',
  ADMIN = 'Admin',
  VIEWER = 'Viewer'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  role: UserRole;

  @ManyToOne(() => Organization, org => org.users)
  organization: Organization;

  @Column()
  organizationId: string;

  @OneToMany(() => Task, task => task.createdBy)
  tasks: Task[];
}