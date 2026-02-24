import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SensorDataItemDto {
  @ApiProperty({ example: '2024-01-15T09:05:00Z' })
  @IsDateString()
  timestamp: string;

  @ApiProperty({ example: 0.12 })
  @IsNumber()
  axisX: number;

  @ApiProperty({ example: -0.05 })
  @IsNumber()
  axisY: number;

  @ApiProperty({ example: 9.81 })
  @IsNumber()
  axisZ: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isUpright: boolean;
}

export class BatchSensorDataDto {
  @ApiProperty({ example: 'session-uuid-here' })
  @IsString()
  sessionId: string;

  @ApiProperty({ type: [SensorDataItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SensorDataItemDto)
  data: SensorDataItemDto[];
}
