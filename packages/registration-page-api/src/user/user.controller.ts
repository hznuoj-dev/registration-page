import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from '@/auth/auth.service';
import { ConfigService } from '@/config/config.service';

import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
}
