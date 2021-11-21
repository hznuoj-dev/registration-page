import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class GetRegistrationListRequestDto {
  @ApiProperty()
  @IsBoolean()
  isApproved?: boolean;
}
