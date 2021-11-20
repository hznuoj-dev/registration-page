import { Controller, Get, Post, Body, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ConfigService } from '@/config/config.service';
import { CurrentUser } from '@/common/user.decorator';
import { MailService, MailTemplate } from '@/mail/mail.service';

import {
  AuthEmailVerificationCodeService,
  EmailVerificationCodeType,
} from './auth-email-verification-code.service';
import { RequestWithSession } from './auth.middleware';
import { AuthService } from './auth.service';
import { AuthSessionService } from './auth-session.service';
import { UserEntity } from '@/user/user.entity';
import { UserService } from '@/user/user.service';
import { AuditService } from '@/audit/audit.service';

import {
  SendEmailVerificationCodeRequestDto,
  SendEmailVerificationCodeResponseDto,
  SendEmailVerificationCodeResponseError,
  GetSessionInfoRequestDto,
  GetSessionInfoResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  LoginResponseError,
} from './dto';

// Refer to auth.middleware.ts for req.session
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly authEmailVerificationCodeService: AuthEmailVerificationCodeService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly authSessionService: AuthSessionService,
    private readonly auditService: AuditService,
  ) {}

  @Get('getSessionInfo')
  @ApiOperation({
    summary:
      "A (JSONP or JSON) request to get current user's info and server preference.",
    description:
      "In order to support JSONP, this API doesn't use HTTP Authorization header.",
  })
  async getSessionInfo(
    @Req() req: RequestWithSession,
    @Query() request: GetSessionInfoRequestDto,
  ): Promise<GetSessionInfoResponseDto> {
    const [, user] = await this.authSessionService.accessSession(request.token);

    const result: GetSessionInfoResponseDto = {};

    if (user) {
      result.userMeta = await this.userService.getUserMeta(user);
    }

    if (request.jsonp) {
      return `(window.getSessionInfoCallback || (function (sessionInfo) { window.sessionInfo = sessionInfo; }))(${JSON.stringify(
        result,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      )});` as any;
    }

    return result;
  }

  @Post('login')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'login.',
    description: 'Recaptcha required. Return the session token if success.',
  })
  async login(
    @Req() req: RequestWithSession,
    @CurrentUser() currentUser: UserEntity,
    @Body() request: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    if (currentUser) {
      return {
        error: LoginResponseError.ALREADY_LOGGEDIN,
      };
    }

    const [error, user] = await this.authService.login(
      request.email,
      request.emailVerificationCode,
    );

    if (error) {
      return {
        error,
      };
    }

    await this.auditService.log(user.id, 'auth.login');

    return {
      token: await this.authSessionService.newSession(
        user,
        req.ip,
        req.headers['user-agent'],
      ),
      userMeta: await this.userService.getUserMeta(user),
    };
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout the current session.',
  })
  async logout(
    @CurrentUser() currentUser: UserEntity,
    @Req() req: RequestWithSession,
  ): Promise<Record<string, unknown>> {
    const sessionKey = req?.session?.sessionKey;
    if (sessionKey) {
      await this.authSessionService.endSession(sessionKey);
    }

    if (currentUser) {
      await this.auditService.log('auth.logout');
    }

    return {};
  }

  @Post('sendEmailVerificationCode')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Send email verification code for login',
  })
  async sendEmailVerificationCode(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: SendEmailVerificationCodeRequestDto,
  ): Promise<SendEmailVerificationCodeResponseDto> {
    if (request.type === EmailVerificationCodeType.Login) {
      if (currentUser) {
        return {
          error: SendEmailVerificationCodeResponseError.ALREADY_LOGGEDIN,
        };
      }
    } else {
      return {
        error: SendEmailVerificationCodeResponseError.PERMISSION_DENIED,
      };
    }

    if (
      !this.configService.config.preference.security.requireEmailVerification
    ) {
      return {
        error: SendEmailVerificationCodeResponseError.FAILED_TO_SEND,
        errorMessage: 'Email verification code disabled.',
      };
    }

    const code = await this.authEmailVerificationCodeService.generate(
      request.email,
    );
    if (!code) {
      return {
        error: SendEmailVerificationCodeResponseError.RATE_LIMITED,
      };
    }

    const sendMailErrorMessage = await this.mailService.sendMail(
      {
        [EmailVerificationCodeType.Login]: MailTemplate.LoginVerificationCode,
      }[request.type],
      request.locale,
      {
        code,
      },
      request.email,
    );

    if (sendMailErrorMessage) {
      return {
        error: SendEmailVerificationCodeResponseError.FAILED_TO_SEND,
        errorMessage: sendMailErrorMessage,
      };
    }

    return {};
  }
}
