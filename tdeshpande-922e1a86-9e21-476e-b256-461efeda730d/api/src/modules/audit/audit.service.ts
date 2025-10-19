import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(
    action: string,
    resource: string,
    resourceId: string | null,
    userId: string | null,
    metadata?: any,
  ): Promise<void> {
    const auditLog = this.auditLogRepository.create({
      action,
      resource,
      resourceId,
      userId,
      metadata,
    });

    await this.auditLogRepository.save(auditLog);
    
    // Also log to console for development
    console.log(`[AUDIT] ${action} on ${resource}${resourceId ? ` (${resourceId})` : ''} by user ${userId}`);
  }

  async findAll(userId?: string): Promise<AuditLog[]> {
    const query = this.auditLogRepository
      .createQueryBuilder('audit')
      .orderBy('audit.createdAt', 'DESC')
      .take(100);

    if (userId) {
      query.where('audit.userId = :userId', { userId });
    }

    return query.getMany();
  }
}
