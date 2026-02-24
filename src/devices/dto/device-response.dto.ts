import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DeviceDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'uuid-v4' })
  userId: string;

  @ApiPropertyOptional({ example: 'My Straight Device' })
  nickname: string | null;

  @ApiProperty({ example: 'STR-000123' })
  serialNumber: string;

  @ApiPropertyOptional({ example: '1.2.3' })
  firmwareVersion: string | null;

  @ApiProperty({ enum: ['CASUAL', 'TRAINING'], example: 'CASUAL' })
  deviceMode: string;

  @ApiProperty({ example: 2, description: '1–4 scale' })
  vibrationPower: number;

  @ApiProperty({
    enum: ['FAST_SHORT', 'MEDIUM_FAST', 'MEDIUM_SLOW', 'SLOW_LONG'],
    example: 'MEDIUM_FAST',
  })
  vibrationSpeed: string;

  @ApiProperty({ example: 5 })
  alertDelaySeconds: number;

  @ApiProperty({ example: 30 })
  alertLevelDegrees: number;

  @ApiProperty({ example: 10 })
  triggerLimitSeconds: number;

  @ApiProperty({
    enum: ['EMPTY', 'CRITICAL', 'IDLE', 'CHARGING', 'FULL'],
    example: 'IDLE',
  })
  batteryState: string;

  @ApiPropertyOptional({ example: 85 })
  batteryPercentage: number | null;

  @ApiProperty({ enum: ['UNSYNCED', 'SYNCING', 'SYNCED'], example: 'UNSYNCED' })
  syncStatus: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class DeviceStatusDto {
  @ApiProperty({
    enum: ['EMPTY', 'CRITICAL', 'IDLE', 'CHARGING', 'FULL'],
    example: 'CHARGING',
  })
  batteryState: string;

  @ApiPropertyOptional({ example: 72 })
  batteryPercentage: number | null;

  @ApiProperty({ enum: ['UNSYNCED', 'SYNCING', 'SYNCED'], example: 'SYNCED' })
  syncStatus: string;

  @ApiPropertyOptional({ example: '1.3.0' })
  firmwareVersion: string | null;
}

export class UnpairResponseDto {
  @ApiProperty({ example: 'Device unpaired successfully' })
  message: string;
}
