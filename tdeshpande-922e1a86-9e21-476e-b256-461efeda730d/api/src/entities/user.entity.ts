import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from './organization.entity';
import { Task } from './task.entity';
import { UserRole } from '@tdeshpande-922e1a86-9e21-476e-b256-461efeda730d/data';

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
