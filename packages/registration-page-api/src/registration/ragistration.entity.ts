import {
  Entity,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Index,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '@/user/user.entity';
import { RegistrationOrganizationEntity } from './registration-organization.entity';

export enum ApproveState {
  PENDING = 'Pending',
  REJECT = 'Reject',
  ACCEPTED = 'Accepted',
}

@Entity('registration')
export class RegistrationEntity {
  @PrimaryGeneratedColumn()
  registrationId: number;

  @OneToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Promise<UserEntity>;

  @Column()
  @Index()
  userId: number;

  @ManyToOne(() => RegistrationOrganizationEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization: Promise<RegistrationOrganizationEntity>;

  @Column()
  @Index()
  organizationId: number;

  @Column({ type: 'varchar', length: 80, nullable: false })
  name: string;

  @Column({ type: 'enum', enum: ApproveState, default: ApproveState.PENDING })
  approveState: ApproveState;
}
