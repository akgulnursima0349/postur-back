import { ApiProperty } from '@nestjs/swagger';

export class CoachMessageDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'uuid-v4' })
  conversationId: string;

  @ApiProperty({ enum: ['USER', 'ASSISTANT'], example: 'ASSISTANT' })
  role: string;

  @ApiProperty({
    example:
      'Great question! To improve your posture while sitting, keep your feet flat on the floor.',
  })
  content: string;

  @ApiProperty()
  createdAt: Date;
}

export class SendMessageResponseDto {
  @ApiProperty({ example: 'uuid-v4', description: 'Use this ID for follow-up messages' })
  conversationId: string;

  @ApiProperty({ type: () => CoachMessageDto })
  message: CoachMessageDto;
}

export class LastMessageDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ enum: ['USER', 'ASSISTANT'], example: 'USER' })
  role: string;

  @ApiProperty({ example: 'How can I improve my posture?' })
  content: string;

  @ApiProperty()
  createdAt: Date;
}

export class CoachConversationDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'uuid-v4' })
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [LastMessageDto], description: 'Last message in conversation' })
  messages: LastMessageDto[];
}
