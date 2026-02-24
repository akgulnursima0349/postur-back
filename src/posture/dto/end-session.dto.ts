import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class EndSessionDto {
  @ApiProperty({ example: 'session-uuid-here' })
  @IsString()
  sessionId: string;

  @ApiProperty({ example: '2024-01-15T09:30:00Z' })
  @IsDateString()
  endTime: string;

  @ApiPropertyOptional({ example: 25.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  uprightTimeMinutes?: number;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalTimeMinutes?: number;

  @ApiPropertyOptional({ example: 82.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  averageScore?: number;
}
