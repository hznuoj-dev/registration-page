import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @Index({ unique: true })
  email: string;

  @Column({ type: 'boolean' })
  isAdmin: boolean;
}
