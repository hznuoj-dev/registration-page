import { ApiProperty } from '@nestjs/swagger';

import { UserMetaDto } from '@/user/dto';

export enum LoginResponseError {
  ALREADY_LOGGEDIN = 'ALREADY_LOGGEDIN',
  DUPLICATE_USERNAME = 'DUPLICATE_USERNAME',
  DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
  INVALID_EMAIL_VERIFICATION_CODE = 'INVALID_EMAIL_VERIFICATION_CODE',
}

export class LoginResponseDto {
  @ApiProperty({ enum: LoginResponseError })
  error?: LoginResponseError;

  @ApiProperty()
  token?: string;

  @ApiProperty()
  userMeta?: UserMetaDto;
}
