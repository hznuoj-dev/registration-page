import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RegistrationService } from './registration.service';

@ApiTags('Registration')
@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}
}
