import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PairDeviceDto {
  @ApiProperty({ example: 'STR-000123', description: 'Device serial number' })
  @IsNotEmpty()
  @IsString()
  serialNumber: string;

  @ApiPropertyOptional({ example: 'My Straight Device' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ example: '1.2.3' })
  @IsOptional()
  @IsString()
  firmwareVersion?: string;
}
