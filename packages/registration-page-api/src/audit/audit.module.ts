import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditLogEntity } from './audit-log.entity';
import { AuditService } from './audit.service';
import { AuditIPLocationService } from '../audit/audit-ip-location.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity])],
  providers: [AuditService, AuditIPLocationService],
  exports: [AuditService, AuditIPLocationService],
})
export class AuditModule {}
