import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { UserEntity } from '@/user/user.entity';

import { RegistrationEntity } from './ragistration.entity';
import { RegistrationOrganizationEntity } from './registration-organization.entity';

import { RegistrationMetaDto } from './dto';

export enum RegistrationType {
  New = 'new',
  Modify = 'modify',
  NothingHappened = 'nothingHappened',
}

@Injectable()
export class RegistrationService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    @InjectRepository(RegistrationOrganizationEntity)
    private readonly registrationOrganizationRepository: Repository<RegistrationOrganizationEntity>,
    @InjectRepository(RegistrationEntity)
    private readonly registrationRepository: Repository<RegistrationEntity>,
  ) {}

  async findRegistrationByUser(user: UserEntity): Promise<RegistrationEntity> {
    return await this.registrationRepository.findOne({
      userId: user.id,
    });
  }

  async findRegistrationById(id: number): Promise<RegistrationEntity> {
    return await this.registrationRepository.findOne({
      registrationId: id,
    });
  }

  async findOrganizationById(
    id: number,
  ): Promise<RegistrationOrganizationEntity> {
    return await this.registrationOrganizationRepository.findOne({
      id,
    });
  }

  async registration(
    user: UserEntity,
    organization: RegistrationOrganizationEntity,
    teamName: string,
  ): Promise<RegistrationType> {
    let registrationType = RegistrationType.NothingHappened;
    let registration = await this.findRegistrationByUser(user);

    if (!registration) {
      registration = new RegistrationEntity();
      registration.userId = user.id;
      registrationType = RegistrationType.New;
    }

    if (
      organization.id !== registration.organizationId ||
      teamName !== registration.teamName
    ) {
      if (registrationType !== RegistrationType.New) {
        registrationType = RegistrationType.Modify;
      }
    }

    registration.organizationId = organization.id;
    registration.teamName = teamName;

    if (registrationType !== RegistrationType.NothingHappened) {
      registration.approve = false;
    }

    await this.registrationRepository.save(registration);

    return registrationType;
  }

  async getRegistrationList(
    isApproved?: boolean,
  ): Promise<RegistrationMetaDto[]> {
    const RegistrationEntityList = await this.registrationRepository.find({
      relations: ['user', 'organization'],
      where:
        isApproved != null
          ? {
              approve: isApproved,
            }
          : {},
    });

    return await Promise.all(
      RegistrationEntityList.map(async (registration) => {
        return <RegistrationMetaDto>{
          email: (await registration.user).email,
          teamName: registration.teamName,
          organizationName: (await registration.organization).organizationName,
        };
      }),
    );
  }

  async approve(registration: RegistrationEntity): Promise<void> {
    registration.approve = true;
    await this.registrationRepository.save(registration);
  }

  async addOrganization(organizationName: string): Promise<void> {
    const organization = new RegistrationOrganizationEntity();
    organization.organizationName = organizationName;
    await this.registrationOrganizationRepository.save(organization);
  }
}
