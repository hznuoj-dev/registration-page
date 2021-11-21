import { CurrentUser } from '@/common/user.decorator';
import { UserEntity } from '@/user/user.entity';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RegistrationService } from './registration.service';

import {
  AddOrganizationRequestDto,
  AddOrganizationResponseDto,
  AddOrganizationResponseError,
  ApproveRequestDto,
  ApproveResponseDto,
  ApproveResponseError,
  GetRegistrationListRequestDto,
  GetRegistrationListResponseDto,
  GetRegistrationListResponseError,
  RegistrationRequestDto,
  RegistrationResponseDto,
  RegistrationResponseError,
} from './dto';

@ApiTags('Registration')
@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @ApiBearerAuth()
  @Post('registration')
  @ApiOperation({
    summary: 'registration.',
  })
  async registration(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: RegistrationRequestDto,
  ): Promise<RegistrationResponseDto> {
    if (!currentUser) {
      return {
        error: RegistrationResponseError.PERMISSION_DENIED,
      };
    }

    const organization = await this.registrationService.findOrganizationById(
      request.organizationId,
    );
    if (!organization) {
      return {
        error: RegistrationResponseError.NO_SUCH_ORGANIZATION,
      };
    }

    await this.registrationService.registration(
      currentUser,
      organization,
      request.teamName,
    );

    return {};
  }

  @ApiBearerAuth()
  @Post('getRegistrationList')
  @ApiOperation({
    summary: 'List All Registrations.',
  })
  @HttpCode(200)
  async getRegistrationList(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: GetRegistrationListRequestDto,
  ): Promise<GetRegistrationListResponseDto> {
    if (!currentUser || !currentUser.isAdmin) {
      return {
        error: GetRegistrationListResponseError.PERMISSION_DENIED,
      };
    }

    return {
      registrationMetaList: await this.registrationService.getRegistrationList(
        request.isApproved,
      ),
    };
  }

  @ApiBearerAuth()
  @Post('approve')
  @ApiOperation({
    summary: 'Approve a registraion.',
  })
  async approve(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: ApproveRequestDto,
  ): Promise<ApproveResponseDto> {
    if (!currentUser || !currentUser.isAdmin) {
      return {
        error: ApproveResponseError.PERMISSION_DENIED,
      };
    }

    const registration = await this.registrationService.findRegistrationById(
      request.registrationId,
    );
    if (!registration) {
      return {
        error: ApproveResponseError.NO_SUCH_REGISTRATION_ID,
      };
    }

    await this.registrationService.approve(registration);

    return {};
  }

  @ApiBearerAuth()
  @Post('addOrganization')
  @ApiOperation({
    summary: 'add a organization',
  })
  async addOrganization(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: AddOrganizationRequestDto,
  ): Promise<AddOrganizationResponseDto> {
    if (!currentUser || !currentUser.isAdmin) {
      return {
        error: AddOrganizationResponseError.PERMISSION_DENIED,
      };
    }

    await this.registrationService.addOrganization(request.organizationName);

    return {};
  }
}
