import { ApiProperty } from '@nestjs/swagger';

export enum ApproveResponseError {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NO_SUCH_REGISTRATION_ID = 'NO_SUCH_REGISTRATION_ID',
  STATE_UNCHANGED = 'STATE_UNCHANGED',
}

export class ApproveResponseDto {
  @ApiProperty()
  error?: ApproveResponseError;
}
