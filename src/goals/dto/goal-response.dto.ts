import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DailyGoalResponseDto {
  @ApiPropertyOptional({ example: 'uuid-v4', description: 'null if returning defaults' })
  id?: string;

  @ApiPropertyOptional({ example: 'uuid-v4' })
  userId?: string;

  @ApiProperty({ example: 30, description: 'Exercise goal in minutes' })
  exerciseDurationMinutes: number;

  @ApiProperty({ example: 480, description: 'Upright time goal in minutes (8 hours)' })
  uprightTimeMinutes: number;

  @ApiProperty({ example: 60, description: 'Device usage goal in minutes' })
  deviceUsageMinutes: number;

  @ApiProperty({ example: '2024-01-15T00:00:00.000Z' })
  date: Date;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional({
    example: true,
    description: 'true when no custom goal set today — showing system defaults',
  })
  isDefault?: boolean;
}
