import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('registration_organization')
export class RegistrationOrganizationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 80 })
  organizationName: string;
}
