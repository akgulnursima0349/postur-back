import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CoachService } from './coach.service';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SendMessageDto } from './dto/send-message.dto';
import {
  CoachConversationDto,
  CoachMessageDto,
  SendMessageResponseDto,
} from './dto/coach-response.dto';
import type { DecodedIdToken } from 'firebase-admin/auth';

@ApiTags('Coach')
@Controller('coach')
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
@ApiExtraModels(SendMessageResponseDto, CoachConversationDto, CoachMessageDto)
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Post('messages')
  @ApiOperation({
    summary: 'Send a message to the AI coach',
    description:
      '**Conversation flow:**\n\n' +
      '1. First message: do NOT send `conversationId` → a new conversation is created.\n' +
      '2. Follow-up messages: send the `conversationId` returned from the previous response to continue the same conversation.\n\n' +
      'Powered by **Llama 3.3 70B** via Groq API. Last 20 messages are included as context.',
  })
  @ApiResponse({
    status: 201,
    description: 'Message sent, assistant response returned',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(SendMessageResponseDto) },
      },
    },
  })
  async sendMessage(
    @CurrentUser() user: DecodedIdToken,
    @Body() dto: SendMessageDto,
  ) {
    return this.coachService.sendMessage(user.uid, dto);
  }

  @Get('conversations')
  @ApiOperation({
    summary: 'Get all coach conversations',
    description: 'Returns conversations with the last message included for preview.',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(CoachConversationDto) },
        },
      },
    },
  })
  async getConversations(@CurrentUser() user: DecodedIdToken) {
    return this.coachService.getConversations(user.uid);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({
    summary: 'Get full message history for a conversation',
    description: 'Returns messages in chronological order (oldest first).',
  })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(CoachMessageDto) },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getMessages(
    @CurrentUser() user: DecodedIdToken,
    @Param('id') id: string,
  ) {
    return this.coachService.getMessages(user.uid, id);
  }
}
