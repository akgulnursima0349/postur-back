import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum DeviceMode {
  CASUAL = 'CASUAL',
  TRAINING = 'TRAINING',
}

export enum VibrationSpeed {
  FAST_SHORT = 'FAST_SHORT',
  MEDIUM_FAST = 'MEDIUM_FAST',
  MEDIUM_SLOW = 'MEDIUM_SLOW',
  SLOW_LONG = 'SLOW_LONG',
}

export class UpdateDeviceSettingsDto {
  @ApiPropertyOptional({ example: 'My Device' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ enum: DeviceMode })
  @IsOptional()
  @IsEnum(DeviceMode)
  deviceMode?: DeviceMode;

  @ApiPropertyOptional({ example: 2, minimum: 1, maximum: 4 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4)
  vibrationPower?: number;

  @ApiPropertyOptional({ enum: VibrationSpeed })
  @IsOptional()
  @IsEnum(VibrationSpeed)
  vibrationSpeed?: VibrationSpeed;

  @ApiPropertyOptional({ example: 5, description: 'Alert delay in seconds' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(60)
  alertDelaySeconds?: number;

  @ApiPropertyOptional({
    example: 30,
    description: 'Alert level in degrees',
  })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(90)
  alertLevelDegrees?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Trigger limit in seconds',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  triggerLimitSeconds?: number;
}
