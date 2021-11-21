import { ApiProperty } from '@nestjs/swagger';

export enum RegistrationResponseError {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NO_SUCH_ORGANIZATION = 'NO_SUCH_ORGANIZATION',
}

export class RegistrationResponseDto {
  @ApiProperty()
  error?: RegistrationResponseError;
}
