import { ApiProperty } from '@nestjs/swagger';

import { UserMetaDto } from '@/user/dto';

export class GetSessionInfoResponseDto {
  @ApiProperty()
  userMeta?: UserMetaDto;
}
