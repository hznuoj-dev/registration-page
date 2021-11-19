import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

import { Connection } from 'typeorm';

import { UserEntity } from '@/user/user.entity';
import { UserService } from '@/user/user.service';
import { ConfigService } from '@/config/config.service';
import { delay, DELAY_FOR_SECURITY } from '@/common/delay';

import { AuthEmailVerificationCodeService } from './auth-email-verification-code.service';

import { LoginResponseError } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthEmailVerificationCodeService))
    private readonly authEmailVerificationCodeService: AuthEmailVerificationCodeService,
    @Inject(forwardRef(() => ConfigService))
    private readonly configService: ConfigService,
  ) {}

  async login(
    email: string,
    emailVerificationCode: string,
  ): Promise<[error: LoginResponseError, user: UserEntity]> {
    // There's a race condition on user inserting. If we do checking before inserting,
    // inserting will still fail if another with same username is inserted after we check

    if (
      this.configService.config.preference.security.requireEmailVerification
    ) {
      // Delay for security
      await delay(DELAY_FOR_SECURITY);

      if (
        !(await this.authEmailVerificationCodeService.verify(
          email,
          emailVerificationCode,
        ))
      ) {
        return [LoginResponseError.INVALID_EMAIL_VERIFICATION_CODE, null];
      }
    }

    try {
      let user: UserEntity;
      await this.connection.transaction(
        'READ COMMITTED',
        async (transactionalEntityManager) => {
          user = new UserEntity();
          user.email = email;
          user.isAdmin = false;

          await transactionalEntityManager.save(user);
        },
      );

      if (
        this.configService.config.preference.security.requireEmailVerification
      ) {
        await this.authEmailVerificationCodeService.revoke(
          email,
          emailVerificationCode,
        );
      }

      return [null, user];
    } catch (e) {
      if (!(await this.userService.checkEmailAvailability(email))) {
        return [LoginResponseError.DUPLICATE_EMAIL, null];
      }

      // Unknown error
      // (or the duplicate user's username is just changed?)
      throw e;
    }
  }
}
