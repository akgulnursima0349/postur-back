import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PostureService } from './posture.service';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { StartSessionDto } from './dto/start-session.dto';
import { EndSessionDto } from './dto/end-session.dto';
import { BatchSensorDataDto } from './dto/batch-sensor-data.dto';
import {
  BatchInsertResponseDto,
  CalibrationResponseDto,
  PaginatedSessionsResponseDto,
  PostureScoreResponseDto,
  PostureSessionDto,
  PostureSessionStatsResponseDto,
} from './dto/session-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import type { DecodedIdToken } from 'firebase-admin/auth';

@ApiTags('Posture')
@Controller('posture')
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
@ApiExtraModels(
  PostureSessionDto,
  PostureSessionStatsResponseDto,
  BatchInsertResponseDto,
  CalibrationResponseDto,
  PostureScoreResponseDto,
  PaginatedSessionsResponseDto,
)
export class PostureController {
  constructor(private readonly postureService: PostureService) {}

  @Post('sessions/start')
  @ApiOperation({
    summary: 'Start a new posture session',
    description: 'Returns a session with an `id`. Store this `id` to call `sessions/end` and `data/batch` later.',
  })
  @ApiResponse({
    status: 201,
    description: 'Session started',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(PostureSessionDto) },
      },
    },
  })
  async startSession(
    @CurrentUser() user: DecodedIdToken,
    @Body() dto: StartSessionDto,
  ) {
    return this.postureService.startSession(user.uid, dto);
  }

  @Post('sessions/end')
  @ApiOperation({
    summary: 'End an active posture session',
    description:
      'Closes the session by setting `endTime` and summary stats. ' +
      'Call this when the user stops wearing the device.',
  })
  @ApiResponse({
    status: 200,
    description: 'Session ended',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(PostureSessionDto) },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async endSession(
    @CurrentUser() user: DecodedIdToken,
    @Body() dto: EndSessionDto,
  ) {
    return this.postureService.endSession(user.uid, dto);
  }

  @Post('data/batch')
  @ApiOperation({
    summary: 'Upload sensor data in batch',
    description:
      'Send multiple sensor readings at once. Recommended: batch every 60 readings ' +
      '(~1 min of data at 1 Hz). Returns count of rows saved.',
  })
  @ApiResponse({
    status: 201,
    description: 'Sensor data saved',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(BatchInsertResponseDto) },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async batchSensorData(
    @CurrentUser() user: DecodedIdToken,
    @Body() dto: BatchSensorDataDto,
  ) {
    return this.postureService.batchSensorData(user.uid, dto);
  }

  @Post('calibrate')
  @ApiOperation({
    summary: 'Calibrate to neutral posture',
    description:
      '**No request body needed.** Call this while the user is sitting/standing in their natural upright position. ' +
      'The returned reference axis values define what "upright" means for this user. ' +
      'Store these values on the device to use as the baseline for future posture detection.',
  })
  @ApiResponse({
    status: 200,
    description: 'Calibration successful',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(CalibrationResponseDto) },
      },
    },
  })
  async calibrate(@CurrentUser() user: DecodedIdToken) {
    return this.postureService.calibrate(user.uid);
  }

  @Get('sessions')
  @ApiOperation({
    summary: 'Get paginated posture sessions',
    description: 'Returns sessions newest-first. Use `page` and `limit` query params to paginate.',
  })
  @ApiResponse({
    status: 200,
    description: 'Sessions retrieved',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(PaginatedSessionsResponseDto) },
      },
    },
  })
  async getSessions(
    @CurrentUser() user: DecodedIdToken,
    @Query() pagination: PaginationDto,
  ) {
    return this.postureService.getSessions(user.uid, pagination);
  }

  @Get('sessions/:id/stats')
  @ApiOperation({
    summary: 'Get detailed stats for a session',
    description: 'Returns the session + computed stats (upright %, score, duration).',
  })
  @ApiResponse({
    status: 200,
    description: 'Stats retrieved',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(PostureSessionStatsResponseDto) },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSessionStats(
    @CurrentUser() user: DecodedIdToken,
    @Param('id') id: string,
  ) {
    return this.postureService.getSessionStats(user.uid, id);
  }

  @Get('score')
  @ApiOperation({
    summary: "Get today's posture score",
    description:
      'Averages `averageScore` across all completed sessions today. ' +
      'Returns `score: null` with a message if no sessions completed yet today.',
  })
  @ApiResponse({
    status: 200,
    description: 'Score retrieved',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(PostureScoreResponseDto) },
      },
    },
  })
  async getScore(@CurrentUser() user: DecodedIdToken) {
    return this.postureService.getScore(user.uid);
  }
}
