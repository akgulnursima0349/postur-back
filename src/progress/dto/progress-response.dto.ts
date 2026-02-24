import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DailyProgressResponseDto {
  @ApiPropertyOptional({ example: 'uuid-v4' })
  id?: string;

  @ApiPropertyOptional({ example: 'uuid-v4' })
  userId?: string;

  @ApiProperty({ example: '2024-01-15T00:00:00.000Z' })
  date: Date;

  @ApiProperty({ example: 28.5, description: 'Minutes exercised today' })
  exerciseActualMinutes: number;

  @ApiProperty({ example: 320, description: 'Minutes spent upright today' })
  uprightActualMinutes: number;

  @ApiProperty({ example: 55, description: 'Minutes device was used today' })
  deviceUsageActualMinutes: number;

  @ApiProperty({ example: 7, description: 'Consecutive days streak' })
  streakDays: number;
}

export class DailyProgressDataDto {
  @ApiProperty()
  date: Date;

  @ApiProperty({ example: 28.5 })
  exerciseActualMinutes: number;

  @ApiProperty({ example: 320 })
  uprightActualMinutes: number;

  @ApiProperty({ example: 55 })
  deviceUsageActualMinutes: number;

  @ApiProperty({ example: 7 })
  streakDays: number;
}

export class AnalyticsResponseDto {
  @ApiProperty({ enum: ['day', 'week', 'month', 'year'], example: 'week' })
  period: string;

  @ApiProperty({ example: '2024-01-08T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ example: '2024-01-15T00:00:00.000Z' })
  endDate: Date;

  @ApiProperty({ example: 12, description: 'Total sessions in period' })
  totalSessions: number;

  @ApiProperty({ example: 245, description: 'Average upright minutes per day' })
  averageUprightMinutes: number;

  @ApiPropertyOptional({ example: 79, description: 'Average posture score, null if no sessions' })
  averageScore: number | null;

  @ApiProperty({ type: [DailyProgressDataDto] })
  dailyData: DailyProgressDataDto[];
}

export class StreakResponseDto {
  @ApiProperty({ example: 7, description: 'Number of consecutive active days' })
  currentStreak: number;

  @ApiProperty({ example: '2024-01-15T00:00:00.000Z' })
  date: Date;
}
