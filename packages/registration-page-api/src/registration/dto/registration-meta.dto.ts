import { ApiProperty } from '@nestjs/swagger';

import { ApproveState } from '../ragistration.entity';

export class RegistrationMetaDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  organizationId: number;

  @ApiProperty()
  organizationName: string;

  @ApiProperty()
  approveState: ApproveState;
}
