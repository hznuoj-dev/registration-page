import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';

import { RegistrationEntity } from './ragistration.entity';
import { RegistrationOrganizationEntity } from './registration-organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegistrationEntity]),
    TypeOrmModule.forFeature([RegistrationOrganizationEntity]),
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule {}
