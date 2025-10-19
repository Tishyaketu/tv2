import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto, UserRole } from '@tdeshpande-922e1a86-9e21-476e-b256-461efeda730d/data';
import { JwtAuthGuard, Roles, CurrentUser } from '@tdeshpande-922e1a86-9e21-476e-b256-461efeda730d/auth';
import { RolesGuard } from '@tdeshpande-922e1a86-9e21-476e-b256-461efeda730d/auth';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: any,
  ): Promise<TaskResponseDto> {
    return this.tasksService.create(
      createTaskDto,
      user.id,
      user.organizationId,
    );
  }

  @Get()
  @Roles(UserRole.VIEWER, UserRole.ADMIN, UserRole.OWNER)
  async findAll(@CurrentUser() user: any): Promise<TaskResponseDto[]> {
    return this.tasksService.findAll(
      user.id,
      user.role,
      user.organizationId,
    );
  }

  @Get(':id')
  @Roles(UserRole.VIEWER, UserRole.ADMIN, UserRole.OWNER)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<TaskResponseDto> {
    return this.tasksService.findOne(
      id,
      user.id,
      user.role,
      user.organizationId,
    );
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: any,
  ): Promise<TaskResponseDto> {
    return this.tasksService.update(
      id,
      updateTaskDto,
      user.id,
      user.role,
      user.organizationId,
    );
  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<void> {
    return this.tasksService.remove(
      id,
      user.id,
      user.role,
      user.organizationId,
    );
  }
}
