import { ApiProperty } from '@nestjs/swagger';

export enum SendEmailVerificationCodeResponseError {
  PERMISSION_DENIED = 'PERMISSION_DENIED', // Change email
  DUPLICATE_EMAIL = 'DUPLICATE_EMAIL', // Change email
  ALREADY_LOGGEDIN = 'ALREADY_LOGGEDIN',
  FAILED_TO_SEND = 'FAILED_TO_SEND',
  RATE_LIMITED = 'RATE_LIMITED',
}

export class SendEmailVerificationCodeResponseDto {
  @ApiProperty({ enum: SendEmailVerificationCodeResponseError })
  error?: SendEmailVerificationCodeResponseError;

  @ApiProperty()
  errorMessage?: string;
}
