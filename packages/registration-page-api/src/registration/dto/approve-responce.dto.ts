import { ApiProperty } from '@nestjs/swagger';

export enum ApproveResponseError {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NO_SUCH_REGISTRATION_ID = 'NO_SUCH_REGISTRATION_ID',
  ALREADY_APPROVED = 'ALREADY_APPROVED',
}

export class ApproveResponseDto {
  @ApiProperty()
  error?: ApproveResponseError;
}
