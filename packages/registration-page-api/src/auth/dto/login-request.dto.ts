import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsString, IsOptional } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly emailVerificationCode?: string;
}
