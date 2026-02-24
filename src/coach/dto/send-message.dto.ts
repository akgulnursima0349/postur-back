import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 'How can I improve my posture while sitting?' })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiPropertyOptional({
    example: 'uuid-of-existing-conversation',
    description: 'If provided, continues existing conversation',
  })
  @IsOptional()
  @IsUUID()
  conversationId?: string;
}
