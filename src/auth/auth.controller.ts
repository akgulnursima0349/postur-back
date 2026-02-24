import { Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SyncUserResponseDto, UserDto, UserProfileDto } from './dto/sync-user-response.dto';
import type { DecodedIdToken } from 'firebase-admin/auth';

@ApiTags('Auth')
@Controller('users')
@ApiExtraModels(SyncUserResponseDto, UserDto, UserProfileDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sync')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Sync Firebase user with database',
    description:
      'Call this right after Firebase login. Creates the user if first time, ' +
      'returns existing user otherwise. Check `isNewUser` to decide whether to show onboarding.',
  })
  @ApiResponse({
    status: 201,
    description: 'User synced successfully',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(SyncUserResponseDto) },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or missing Firebase token' })
  async syncUser(@CurrentUser() user: DecodedIdToken) {
    return this.authService.syncUser(user);
  }
}
