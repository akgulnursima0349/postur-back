import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StartSessionDto } from './dto/start-session.dto';
import { EndSessionDto } from './dto/end-session.dto';
import { BatchSensorDataDto } from './dto/batch-sensor-data.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PostureService {
  constructor(private readonly prisma: PrismaService) {}

  private async getUserId(firebaseUid: string) {
    const user = await this.prisma.user.findUnique({
      where: { firebaseUid },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user.id;
  }

  async startSession(firebaseUid: string, dto: StartSessionDto) {
    const userId = await this.getUserId(firebaseUid);
    return this.prisma.postureSession.create({
      data: {
        userId,
        startTime: new Date(dto.startTime),
      },
    });
  }

  async endSession(firebaseUid: string, dto: EndSessionDto) {
    const userId = await this.getUserId(firebaseUid);
    const session = await this.prisma.postureSession.findFirst({
      where: { id: dto.sessionId, userId },
    });
    if (!session) throw new NotFoundException('Session not found');

    return this.prisma.postureSession.update({
      where: { id: dto.sessionId },
      data: {
        endTime: new Date(dto.endTime),
        uprightTimeMinutes: dto.uprightTimeMinutes,
        totalTimeMinutes: dto.totalTimeMinutes,
        averageScore: dto.averageScore,
      },
    });
  }

  async batchSensorData(firebaseUid: string, dto: BatchSensorDataDto) {
    const userId = await this.getUserId(firebaseUid);
    const session = await this.prisma.postureSession.findFirst({
      where: { id: dto.sessionId, userId },
    });
    if (!session) throw new NotFoundException('Session not found');

    await this.prisma.sensorData.createMany({
      data: dto.data.map((item) => ({
        sessionId: dto.sessionId,
        timestamp: new Date(item.timestamp),
        axisX: item.axisX,
        axisY: item.axisY,
        axisZ: item.axisZ,
        isUpright: item.isUpright,
      })),
    });

    return { inserted: dto.data.length };
  }

  async calibrate(firebaseUid: string) {
    await this.getUserId(firebaseUid);
    return {
      calibrated: true,
      referenceAxisX: 0,
      referenceAxisY: 0,
      referenceAxisZ: 9.81,
      timestamp: new Date(),
    };
  }

  async getSessions(firebaseUid: string, pagination: PaginationDto) {
    const userId = await this.getUserId(firebaseUid);
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.postureSession.findMany({
        where: { userId },
        orderBy: { startTime: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.postureSession.count({ where: { userId } }),
    ]);

    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSessionStats(firebaseUid: string, sessionId: string) {
    const userId = await this.getUserId(firebaseUid);
    const session = await this.prisma.postureSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        sensorData: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });
    if (!session) throw new NotFoundException('Session not found');

    const total = session.sensorData.length;
    const upright = session.sensorData.filter((d) => d.isUpright).length;
    const uprightPercent = total > 0 ? Math.round((upright / total) * 100) : 0;

    return {
      session,
      stats: {
        totalDataPoints: total,
        uprightDataPoints: upright,
        uprightPercent,
        averageScore: session.averageScore,
        durationMinutes: session.totalTimeMinutes,
      },
    };
  }

  async getScore(firebaseUid: string) {
    const userId = await this.getUserId(firebaseUid);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessions = await this.prisma.postureSession.findMany({
      where: {
        userId,
        startTime: { gte: today },
        endTime: { not: null },
      },
    });

    if (sessions.length === 0) {
      return { score: null, message: 'No completed sessions today' };
    }

    const avg =
      sessions.reduce((sum, s) => sum + (s.averageScore ?? 0), 0) /
      sessions.length;

    return {
      score: Math.round(avg),
      sessionsToday: sessions.length,
      totalUprightMinutes: sessions.reduce(
        (sum, s) => sum + (s.uprightTimeMinutes ?? 0),
        0,
      ),
    };
  }
}
