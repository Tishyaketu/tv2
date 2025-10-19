import { TaskCategory, TaskStatus } from '../enums/task.enum';

export class CreateTaskDto {
  title!: string;
  description?: string;
  category?: TaskCategory;
  status?: TaskStatus;
  order?: number;
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  category?: TaskCategory;
  status?: TaskStatus;
  order?: number;
}

export class TaskResponseDto {
  id!: string;
  title!: string;
  description?: string;
  category!: TaskCategory;
  status!: TaskStatus;
  order!: number;
  organizationId!: string;
  createdById!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
