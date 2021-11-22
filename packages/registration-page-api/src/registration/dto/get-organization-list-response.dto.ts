import { ApiProperty } from '@nestjs/swagger';

import { RegistrationOrganizationEntity } from '../registration-organization.entity';

export class GetOrganizationListResponseDto {
  @ApiProperty()
  registrationMetaList: RegistrationOrganizationEntity[];
}
