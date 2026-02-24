import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum BatteryState {
  EMPTY = 'EMPTY',
  CRITICAL = 'CRITICAL',
  IDLE = 'IDLE',
  CHARGING = 'CHARGING',
  FULL = 'FULL',
}

export class SyncDeviceDto {
  @ApiPropertyOptional({ enum: BatteryState })
  @IsOptional()
  @IsEnum(BatteryState)
  batteryState?: BatteryState;

  @ApiPropertyOptional({ example: 85, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  batteryPercentage?: number;

  @ApiPropertyOptional({ example: '1.3.0' })
  @IsOptional()
  firmwareVersion?: string;
}
