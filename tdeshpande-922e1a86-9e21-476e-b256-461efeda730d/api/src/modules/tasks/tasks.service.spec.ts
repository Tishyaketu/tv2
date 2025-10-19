import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Task } from '../../entities/task.entity';
import { AuditService } from '../audit/audit.service';
import { UserRole } from '@tdeshpande-922e1a86-9e21-476e-b256-461efeda730d/data';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const mockTask = {
        id: '1',
        ...createTaskDto,
        createdById: 'user-1',
        organizationId: 'org-1',
      };

      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto, 'user-1', 'org-1');

      expect(result).toEqual(mockTask);
      expect(mockAuditService.log).toHaveBeenCalledWith(
        'CREATE',
        'Task',
        '1',
        'user-1',
        expect.any(Object)
      );
    });
  });

  describe('remove', () => {
    it('should allow Owner to delete task', async () => {
      const mockTask = {
        id: '1',
        title: 'Test',
        organizationId: 'org-1',
        createdById: 'user-1',
      };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockTaskRepository.remove.mockResolvedValue(mockTask);

      await service.remove('1', 'user-1', UserRole.OWNER, 'org-1');

      expect(mockTaskRepository.remove).toHaveBeenCalledWith(mockTask);
      expect(mockAuditService.log).toHaveBeenCalledWith(
        'DELETE',
        'Task',
        '1',
        'user-1'
      );
    });

    it('should throw ForbiddenException when Viewer tries to delete', async () => {
      const mockTask = {
        id: '1',
        title: 'Test',
        organizationId: 'org-1',
        createdById: 'user-1',
      };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      await expect(
        service.remove('1', 'user-2', UserRole.VIEWER, 'org-1')
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(
        service.remove('999', 'user-1', UserRole.OWNER, 'org-1')
      ).rejects.toThrow(NotFoundException);
    });
  });
});
