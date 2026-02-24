import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PostureSessionDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'uuid-v4' })
  userId: string;

  @ApiProperty({ example: '2024-01-15T09:00:00.000Z' })
  startTime: Date;

  @ApiPropertyOptional({ example: '2024-01-15T09:30:00.000Z' })
  endTime: Date | null;

  @ApiPropertyOptional({ example: 25.5, description: 'Minutes spent upright' })
  uprightTimeMinutes: number | null;

  @ApiPropertyOptional({ example: 30, description: 'Total session duration in minutes' })
  totalTimeMinutes: number | null;

  @ApiPropertyOptional({ example: 82.5, description: 'Score 0–100' })
  averageScore: number | null;

  @ApiProperty()
  createdAt: Date;
}

export class SessionStatsDto {
  @ApiProperty({ example: 360 })
  totalDataPoints: number;

  @ApiProperty({ example: 300 })
  uprightDataPoints: number;

  @ApiProperty({ example: 83, description: 'Percentage of time upright' })
  uprightPercent: number;

  @ApiPropertyOptional({ example: 82.5 })
  averageScore: number | null;

  @ApiPropertyOptional({ example: 30 })
  durationMinutes: number | null;
}

export class PostureSessionStatsResponseDto {
  @ApiProperty({ type: () => PostureSessionDto })
  session: PostureSessionDto;

  @ApiProperty({ type: () => SessionStatsDto })
  stats: SessionStatsDto;
}

export class BatchInsertResponseDto {
  @ApiProperty({ example: 60, description: 'Number of sensor data rows saved' })
  inserted: number;
}

export class CalibrationResponseDto {
  @ApiProperty({ example: true })
  calibrated: boolean;

  @ApiProperty({ example: 0.0, description: 'Reference X-axis value at neutral posture' })
  referenceAxisX: number;

  @ApiProperty({ example: 0.0, description: 'Reference Y-axis value at neutral posture' })
  referenceAxisY: number;

  @ApiProperty({ example: 9.81, description: 'Reference Z-axis value at neutral posture' })
  referenceAxisZ: number;

  @ApiProperty()
  timestamp: Date;
}

export class PostureScoreResponseDto {
  @ApiPropertyOptional({ example: 78, description: "Today's average score 0–100, null if no sessions yet" })
  score: number | null;

  @ApiPropertyOptional({ example: 2 })
  sessionsToday: number;

  @ApiPropertyOptional({ example: 95.5, description: 'Total upright minutes today' })
  totalUprightMinutes: number;

  @ApiPropertyOptional({ example: 'No completed sessions today' })
  message: string;
}

export class PaginatedSessionsResponseDto {
  @ApiProperty({ type: [PostureSessionDto] })
  items: PostureSessionDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 45 })
  total: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}
