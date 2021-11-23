import { ApiProperty } from '@nestjs/swagger';

import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class RegistrationRequestDto {
  @ApiProperty()
  @IsNumber()
  organizationId: number;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  name: string;
}
