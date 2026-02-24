import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type Period = 'day' | 'week' | 'month' | 'year';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  private async getUserId(firebaseUid: string) {
    const user = await this.prisma.user.findUnique({
      where: { firebaseUid },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user.id;
  }

  private todayDate() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  async getDailyProgress(firebaseUid: string) {
    const userId = await this.getUserId(firebaseUid);
    const today = this.todayDate();

    const progress = await this.prisma.dailyProgress.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    return (
      progress ?? {
        exerciseActualMinutes: 0,
        uprightActualMinutes: 0,
        deviceUsageActualMinutes: 0,
        streakDays: 0,
        date: today,
      }
    );
  }

  async getAnalytics(firebaseUid: string, period: Period) {
    const userId = await this.getUserId(firebaseUid);
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const progresses = await this.prisma.dailyProgress.findMany({
      where: {
        userId,
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
    });

    const sessions = await this.prisma.postureSession.findMany({
      where: {
        userId,
        startTime: { gte: startDate },
        endTime: { not: null },
      },
    });

    const totalDays = progresses.length;
    const avgUpright =
      totalDays > 0
        ? progresses.reduce((s, p) => s + p.uprightActualMinutes, 0) /
          totalDays
        : 0;
    const avgScore =
      sessions.length > 0
        ? sessions.reduce((s, ses) => s + (ses.averageScore ?? 0), 0) /
          sessions.length
        : null;

    return {
      period,
      startDate,
      endDate: now,
      totalSessions: sessions.length,
      averageUprightMinutes: Math.round(avgUpright),
      averageScore: avgScore ? Math.round(avgScore) : null,
      dailyData: progresses,
    };
  }

  async getStreak(firebaseUid: string) {
    const userId = await this.getUserId(firebaseUid);
    const today = this.todayDate();

    const latest = await this.prisma.dailyProgress.findUnique({
      where: { userId_date: { userId, date: today } },
      select: { streakDays: true },
    });

    return {
      currentStreak: latest?.streakDays ?? 0,
      date: today,
    };
  }
}
