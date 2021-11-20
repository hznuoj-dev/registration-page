import { Module, forwardRef } from '@nestjs/common';

import { UserModule } from '@/user/user.module';
import { RedisModule } from '@/redis/redis.module';
import { MailModule } from '@/mail/mail.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthEmailVerificationCodeService } from './auth-email-verification-code.service';
import { AuthSessionService } from './auth-session.service';
import { AuditModule } from '@/audit/audit.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => RedisModule),
    forwardRef(() => MailModule),
    forwardRef(() => AuditModule),
  ],
  providers: [
    AuthService,
    AuthEmailVerificationCodeService,
    AuthSessionService,
  ],
  controllers: [AuthController],
  exports: [AuthService, AuthEmailVerificationCodeService, AuthSessionService],
})
export class AuthModule {}
