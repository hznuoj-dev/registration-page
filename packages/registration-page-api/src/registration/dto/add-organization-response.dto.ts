import { ApiProperty } from '@nestjs/swagger';

export enum AddOrganizationResponseError {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}

export class AddOrganizationResponseDto {
  @ApiProperty()
  error?: AddOrganizationResponseError;
}
