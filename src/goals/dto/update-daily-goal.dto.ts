import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateDailyGoalDto {
  @ApiPropertyOptional({ example: 30, description: 'Exercise duration in minutes' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(480)
  exerciseDurationMinutes?: number;

  @ApiPropertyOptional({ example: 480, description: 'Upright time goal in minutes' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(960)
  uprightTimeMinutes?: number;

  @ApiPropertyOptional({ example: 60, description: 'Device usage goal in minutes' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(480)
  deviceUsageMinutes?: number;
}
