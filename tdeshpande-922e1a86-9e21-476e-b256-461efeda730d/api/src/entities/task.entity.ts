import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';

export enum TaskCategory {
  WORK = 'Work',
  PERSONAL = 'Personal'
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'text', default: TaskCategory.WORK })
  category: TaskCategory;

  @Column({ type: 'text', default: TaskStatus.PENDING })
  status: TaskStatus;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Organization, org => org.tasks)
  organization: Organization;

  @Column()
  organizationId: string;

  @ManyToOne(() => User, user => user.tasks)
  createdBy: User;

  @Column()
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}