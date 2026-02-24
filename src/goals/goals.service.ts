import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDailyGoalDto } from './dto/update-daily-goal.dto';

@Injectable()
export class GoalsService {
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

  async getDailyGoal(firebaseUid: string) {
    const userId = await this.getUserId(firebaseUid);
    const today = this.todayDate();

    const goal = await this.prisma.dailyGoal.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    if (!goal) {
      // Return defaults if no goal set for today
      return {
        exerciseDurationMinutes: 30,
        uprightTimeMinutes: 480,
        deviceUsageMinutes: 60,
        date: today,
        isDefault: true,
      };
    }

    return goal;
  }

  async updateDailyGoal(firebaseUid: string, dto: UpdateDailyGoalDto) {
    const userId = await this.getUserId(firebaseUid);
    const today = this.todayDate();

    return this.prisma.dailyGoal.upsert({
      where: { userId_date: { userId, date: today } },
      update: { ...dto },
      create: {
        userId,
        date: today,
        exerciseDurationMinutes: dto.exerciseDurationMinutes ?? 30,
        uprightTimeMinutes: dto.uprightTimeMinutes ?? 480,
        deviceUsageMinutes: dto.deviceUsageMinutes ?? 60,
      },
    });
  }
}
