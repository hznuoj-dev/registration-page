import { ApiProperty } from '@nestjs/swagger';

import { RegistrationMetaDto } from './registration-meta.dto';

export enum GetRegistrationResponseError {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NO_SUCH_REGISTRATION = 'NO_SUCH_REGISTRATION',
}

export class GetRegistrationResponseDto {
  @ApiProperty()
  error?: GetRegistrationResponseError;

  registrationMeta?: RegistrationMetaDto;
}
