import { ApiProperty } from '@nestjs/swagger';

import { RegistrationMetaDto } from './registration-meta.dto';

export enum GetRegistrationListResponseError {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}

export class GetRegistrationListResponseDto {
  @ApiProperty()
  error?: GetRegistrationListResponseError;

  registrationMetaList?: RegistrationMetaDto[];
}
