import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ApproveState } from '../ragistration.entity';

export class GetRegistrationListRequestDto {
  @ApiProperty()
  @IsEnum(ApproveState)
  approveState?: ApproveState;
}
