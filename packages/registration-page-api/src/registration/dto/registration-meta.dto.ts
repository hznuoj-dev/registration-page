import { ApiProperty } from '@nestjs/swagger';

export class RegistrationMetaDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  organizationName: string;
}
