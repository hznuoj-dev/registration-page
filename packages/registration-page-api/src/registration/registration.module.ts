import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';

import { RegistrationEntity } from './ragistration.entity';
import { RegistrationOrganizationEntity } from './registration-organization.entity';

import { MailModule } from '@/mail/mail.module';
import { AuditModule } from '@/audit/audit.module';
import { EventReportModule } from '@/event-report/event-report.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegistrationEntity]),
    TypeOrmModule.forFeature([RegistrationOrganizationEntity]),
    forwardRef(() => MailModule),
    forwardRef(() => AuditModule),
    forwardRef(() => EventReportModule),
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule {}
