import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';

import { Repository, Connection } from 'typeorm';

import { ConfigService } from '@/config/config.service';
import { AuthEmailVerificationCodeService } from '@/auth/auth-email-verification-code.service';

import { UserEntity } from './user.entity';

import { UserMetaDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthEmailVerificationCodeService))
    private readonly authEmailVerificationCodeService: AuthEmailVerificationCodeService,
    @Inject(forwardRef(() => ConfigService))
    private readonly configService: ConfigService,
  ) {}

  async findUserById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      id,
    });
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      email,
    });
  }

  async userExists(id: number): Promise<boolean> {
    return (await this.userRepository.count({ id })) !== 0;
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    return (
      (await this.userRepository.count({
        email,
      })) === 0
    );
  }

  async getUserMeta(user: UserEntity): Promise<UserMetaDto> {
    return {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }
}
