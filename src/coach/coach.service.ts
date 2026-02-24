import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import Groq from 'groq-sdk';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

const SYSTEM_PROMPT = `You are Straight Coach, an expert AI posture and wellness coach for the Straight posture correction app.

Your role:
- Help users improve their posture, reduce back/neck pain, and build healthy movement habits
- Give practical, science-based advice on posture correction, ergonomics, and exercise
- Motivate and encourage users in a friendly, supportive tone
- Reference the user's Straight wearable device when relevant (it vibrates to alert bad posture)
- Keep responses concise and actionable (2-4 sentences unless more detail is requested)

Do NOT:
- Give medical diagnoses or replace professional medical advice
- Mention competitor products
- Go off-topic from posture, wellness, and healthy habits`;

@Injectable()
export class CoachService {
  private readonly logger = new Logger(CoachService.name);
  private readonly groq: Groq;

  constructor(private readonly prisma: PrismaService) {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  private async getUserId(firebaseUid: string) {
    const user = await this.prisma.user.findUnique({
      where: { firebaseUid },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user.id;
  }

  async sendMessage(firebaseUid: string, dto: SendMessageDto) {
    const userId = await this.getUserId(firebaseUid);

    // Konuşmayı bul veya oluştur
    let conversation = dto.conversationId
      ? await this.prisma.coachConversation.findFirst({
          where: { id: dto.conversationId, userId },
        })
      : null;

    if (!conversation) {
      conversation = await this.prisma.coachConversation.create({
        data: { userId },
      });
    }

    // Geçmiş mesajları al (context için son 20 mesaj)
    const history = await this.prisma.coachMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    // Kullanıcı mesajını kaydet
    await this.prisma.coachMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: dto.content,
      },
    });

    // Groq'a gönderilecek mesaj geçmişini hazırla
    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map((m) => ({
        role: m.role === 'USER' ? ('user' as const) : ('assistant' as const),
        content: m.content,
      })),
      { role: 'user', content: dto.content },
    ];

    // Groq API çağrısı
    let aiReply: string;
    try {
      const completion = await this.groq.chat.completions.create({
        model: process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 512,
        temperature: 0.7,
      });
      aiReply = completion.choices[0]?.message?.content ?? 'No response from AI.';
    } catch (err) {
      this.logger.error('Groq API error:', err);
      throw new InternalServerErrorException('AI service temporarily unavailable');
    }

    // AI cevabını kaydet
    const assistantMessage = await this.prisma.coachMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'ASSISTANT',
        content: aiReply,
      },
    });

    return {
      conversationId: conversation.id,
      message: assistantMessage,
    };
  }

  async getConversations(firebaseUid: string) {
    const userId = await this.getUserId(firebaseUid);
    return this.prisma.coachConversation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  async getMessages(firebaseUid: string, conversationId: string) {
    const userId = await this.getUserId(firebaseUid);
    const conversation = await this.prisma.coachConversation.findFirst({
      where: { id: conversationId, userId },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    return this.prisma.coachMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
