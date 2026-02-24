import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { GoalsService } from './goals.service';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateDailyGoalDto } from './dto/update-daily-goal.dto';
import { DailyGoalResponseDto } from './dto/goal-response.dto';
import type { DecodedIdToken } from 'firebase-admin/auth';

@ApiTags('Goals')
@Controller('goals')
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
@ApiExtraModels(DailyGoalResponseDto)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get('daily')
  @ApiOperation({
    summary: "Get today's daily goals",
    description:
      'Returns the goals set for today. If no custom goals are set, returns system defaults ' +
      '(30 min exercise, 8h upright, 1h device). Check `isDefault: true` for this case.',
  })
  @ApiResponse({
    status: 200,
    description: 'Daily goals retrieved',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(DailyGoalResponseDto) },
      },
    },
  })
  async getDailyGoal(@CurrentUser() user: DecodedIdToken) {
    return this.goalsService.getDailyGoal(user.uid);
  }

  @Put('daily')
  @ApiOperation({
    summary: "Set today's daily goals",
    description: 'Creates or replaces the goals for today. Send only the fields you want to change.',
  })
  @ApiResponse({
    status: 200,
    description: 'Daily goals updated',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(DailyGoalResponseDto) },
      },
    },
  })
  async updateDailyGoal(
    @CurrentUser() user: DecodedIdToken,
    @Body() dto: UpdateDailyGoalDto,
  ) {
    return this.goalsService.updateDailyGoal(user.uid, dto);
  }
}
