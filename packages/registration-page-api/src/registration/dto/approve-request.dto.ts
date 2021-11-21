import { ApiProperty } from '@nestjs/swagger';

import { IsNumber } from 'class-validator';

export class ApproveRequestDto {
  @ApiProperty()
  @IsNumber()
  registrationId: number;
}
