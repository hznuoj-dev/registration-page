import { ApiProperty } from '@nestjs/swagger';

export class UserMetaDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isAdmin: boolean;
}
