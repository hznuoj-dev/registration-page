import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class GetSessionInfoRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  token?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  jsonp?: boolean;
}
