import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class StartSessionDto {
  @ApiProperty({ example: '2024-01-15T09:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiPropertyOptional({ example: 'device-uuid-here' })
  @IsOptional()
  @IsString()
  deviceId?: string;
}
