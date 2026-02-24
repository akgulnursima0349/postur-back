import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePhysicalDto } from './dto/update-physical.dto';
import { UserProfileDto } from '../auth/dto/sync-user-response.dto';
import type { DecodedIdToken } from 'firebase-admin/auth';

@ApiTags('Users')
@Controller('users')
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
@ApiExtraModels(UserProfileDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the User record with the nested UserProfile.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-v4' },
            firebaseUid: { type: 'string', example: 'firebase-uid' },
            email: { type: 'string', example: 'user@example.com', nullable: true },
            phoneNumber: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            profile: { $ref: getSchemaPath(UserProfileDto) },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@CurrentUser() user: DecodedIdToken) {
    return this.usersService.getProfile(user.uid);
  }

  @Put('profile')
  @ApiOperation({
    summary: 'Update personal info',
    description: 'Updates name, gender, and date of birth. All fields optional — send only what changed.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(UserProfileDto) },
      },
    },
  })
  async updateProfile(
    @CurrentUser() user: DecodedIdToken,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.uid, dto);
  }

  @Put('profile/physical')
  @ApiOperation({
    summary: 'Update physical measurements',
    description: 'Updates height (cm) and weight (kg). Used during onboarding and settings.',
  })
  @ApiResponse({
    status: 200,
    description: 'Physical info updated',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(UserProfileDto) },
      },
    },
  })
  async updatePhysical(
    @CurrentUser() user: DecodedIdToken,
    @Body() dto: UpdatePhysicalDto,
  ) {
    return this.usersService.updatePhysical(user.uid, dto);
  }

  @Get('onboarding-status')
  @ApiOperation({
    summary: 'Get onboarding completion status',
    description:
      '`hasProfile` = name/gender filled. `hasPhysicalData` = height/weight filled. ' +
      '`onboardingCompleted` is set to true only after user explicitly completes the flow.',
  })
  @ApiResponse({
    status: 200,
    description: 'Onboarding status',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            onboardingCompleted: { type: 'boolean', example: false },
            hasProfile: { type: 'boolean', example: true },
            hasPhysicalData: { type: 'boolean', example: false },
          },
        },
      },
    },
  })
  async getOnboardingStatus(@CurrentUser() user: DecodedIdToken) {
    return this.usersService.getOnboardingStatus(user.uid);
  }
}
