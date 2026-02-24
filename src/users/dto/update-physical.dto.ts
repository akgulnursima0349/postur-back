import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdatePhysicalDto {
  @ApiPropertyOptional({ example: 168, description: 'Height in centimeters' })
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(250)
  heightCm?: number;

  @ApiPropertyOptional({ example: 65.5, description: 'Weight in kilograms' })
  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(300)
  weightKg?: number;
}
