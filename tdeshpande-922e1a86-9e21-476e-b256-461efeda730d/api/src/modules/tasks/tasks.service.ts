import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from '@tdeshpande-922e1a86-9e21-476e-b256-461efeda730d/data';
import { UserRole } from '@tdeshpande-922e1a86-9e21-476e-b256-461efeda730d/data';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private auditService: AuditService,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    userId: string,
    organizationId: string,
  ): Promise<TaskResponseDto> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      createdById: userId,
      organizationId,
    });

    const savedTask = await this.taskRepository.save(task);

    await this.auditService.log('CREATE', 'Task', savedTask.id, userId, {
      title: savedTask.title,
    });

    return savedTask;
  }

  async findAll(
    userId: string,
    userRole: UserRole,
    organizationId: string,
  ): Promise<TaskResponseDto[]> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .leftJoinAndSelect('task.organization', 'organization')
      .where('task.organizationId = :organizationId', { organizationId });

    // Viewers can only see their own tasks
    if (userRole === UserRole.VIEWER) {
      query.andWhere('task.createdById = :userId', { userId });
    }

    const tasks = await query.orderBy('task.order', 'ASC').getMany();

    await this.auditService.log('LIST', 'Task', null, userId);

    return tasks;
  }

  async findOne(
    id: string,
    userId: string,
    userRole: UserRole,
    organizationId: string,
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['createdBy', 'organization'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check organization access
    if (task.organizationId !== organizationId) {
      throw new ForbiddenException('Access denied to this task');
    }

    // Viewers can only see their own tasks
    if (userRole === UserRole.VIEWER && task.createdById !== userId) {
      throw new ForbiddenException('Access denied to this task');
    }

    await this.auditService.log('READ', 'Task', id, userId);

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
    userRole: UserRole,
    organizationId: string,
  ): Promise<TaskResponseDto> {
    const task = await this.findOne(id, userId, userRole, organizationId);

    // Viewers cannot update tasks
    if (userRole === UserRole.VIEWER) {
      throw new ForbiddenException('Viewers cannot update tasks');
    }

    Object.assign(task, updateTaskDto);
    const updatedTask = await this.taskRepository.save(task);

    await this.auditService.log('UPDATE', 'Task', id, userId, {
      changes: updateTaskDto,
    });

    return updatedTask;
  }

  async remove(
    id: string,
    userId: string,
    userRole: UserRole,
    organizationId: string,
  ): Promise<void> {
    const task = await this.findOne(id, userId, userRole, organizationId);

    // Only Owners can delete
    if (userRole !== UserRole.OWNER) {
      throw new ForbiddenException('Only Owners can delete tasks');
    }

    await this.taskRepository.remove(task);

    await this.auditService.log('DELETE', 'Task', id, userId);
  }
}
