import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  AnalyticsResponseDto,
  DailyProgressResponseDto,
  StreakResponseDto,
} from './dto/progress-response.dto';
import type { DecodedIdToken } from 'firebase-admin/auth';

type Period = 'day' | 'week' | 'month' | 'year';

@ApiTags('Progress')
@Controller('progress')
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
@ApiExtraModels(DailyProgressResponseDto, AnalyticsResponseDto, StreakResponseDto)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('daily')
  @ApiOperation({
    summary: "Get today's actual progress",
    description:
      "Returns how much the user actually exercised, was upright, and used the device today. " +
      "Combine with GET /api/goals/daily to show progress bars.",
  })
  @ApiResponse({
    status: 200,
    description: 'Daily progress retrieved',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(DailyProgressResponseDto) },
      },
    },
  })
  async getDailyProgress(@CurrentUser() user: DecodedIdToken) {
    return this.progressService.getDailyProgress(user.uid);
  }

  @Get('analytics')
  @ApiOperation({
    summary: 'Get analytics summary for a time period',
    description:
      'Returns aggregated stats and daily breakdown for the chosen period. ' +
      'Use `dailyData` to draw charts.',
  })
  @ApiQuery({
    name: 'period',
    enum: ['day', 'week', 'month', 'year'],
    required: false,
    description: 'Time period to aggregate. Defaults to "week".',
    example: 'week',
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics retrieved',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(AnalyticsResponseDto) },
      },
    },
  })
  async getAnalytics(
    @CurrentUser() user: DecodedIdToken,
    @Query('period') period: Period = 'week',
  ) {
    const validPeriods = ['day', 'week', 'month', 'year'];
    const safePeriod: Period = validPeriods.includes(period) ? period : 'week';
    return this.progressService.getAnalytics(user.uid, safePeriod);
  }

  @Get('streak')
  @ApiOperation({
    summary: 'Get current activity streak',
    description: 'Returns how many consecutive days the user has been active.',
  })
  @ApiResponse({
    status: 200,
    description: 'Streak retrieved',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(StreakResponseDto) },
      },
    },
  })
  async getStreak(@CurrentUser() user: DecodedIdToken) {
    return this.progressService.getStreak(user.uid);
  }
}
