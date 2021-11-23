import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNumber } from 'class-validator';
import { ApproveState } from '../ragistration.entity';

export class ApproveRequestDto {
  @ApiProperty()
  @IsNumber()
  registrationId: number;

  @ApiProperty()
  @IsEnum(ApproveState)
  approveState: ApproveState;
}
