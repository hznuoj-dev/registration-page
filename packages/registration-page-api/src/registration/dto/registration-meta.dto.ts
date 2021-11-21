import { ApiProperty } from '@nestjs/swagger';

export class RegistrationMetaDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  teamName: string;

  @ApiProperty()
  organizationName: string;
}
