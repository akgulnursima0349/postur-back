import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PairDeviceDto } from './dto/pair-device.dto';
import { UpdateDeviceSettingsDto } from './dto/update-device-settings.dto';
import { SyncDeviceDto } from './dto/sync-device.dto';

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  private async getUserId(firebaseUid: string) {
    const user = await this.prisma.user.findUnique({
      where: { firebaseUid },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user.id;
  }

  async pairDevice(firebaseUid: string, dto: PairDeviceDto) {
    const userId = await this.getUserId(firebaseUid);

    const existing = await this.prisma.device.findUnique({
      where: { serialNumber: dto.serialNumber },
    });

    if (existing && existing.userId !== userId) {
      throw new ConflictException('Device is already paired to another user');
    }

    if (existing) {
      return this.prisma.device.update({
        where: { id: existing.id },
        data: {
          userId,
          nickname: dto.nickname,
          firmwareVersion: dto.firmwareVersion,
          syncStatus: 'UNSYNCED',
        },
      });
    }

    return this.prisma.device.create({
      data: {
        userId,
        serialNumber: dto.serialNumber,
        nickname: dto.nickname,
        firmwareVersion: dto.firmwareVersion,
      },
    });
  }

  async getMyDevice(firebaseUid: string) {
    const userId = await this.getUserId(firebaseUid);
    const device = await this.prisma.device.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    if (!device) throw new NotFoundException('No device paired');
    return device;
  }

  async updateSettings(
    firebaseUid: string,
    deviceId: string,
    dto: UpdateDeviceSettingsDto,
  ) {
    const userId = await this.getUserId(firebaseUid);
    const device = await this.prisma.device.findFirst({
      where: { id: deviceId, userId },
    });
    if (!device) throw new NotFoundException('Device not found');

    return this.prisma.device.update({
      where: { id: deviceId },
      data: { ...dto },
    });
  }

  async syncDevice(
    firebaseUid: string,
    deviceId: string,
    dto: SyncDeviceDto,
  ) {
    const userId = await this.getUserId(firebaseUid);
    const device = await this.prisma.device.findFirst({
      where: { id: deviceId, userId },
    });
    if (!device) throw new NotFoundException('Device not found');

    return this.prisma.device.update({
      where: { id: deviceId },
      data: {
        ...dto,
        syncStatus: 'SYNCED',
      },
    });
  }

  async getStatus(firebaseUid: string, deviceId: string) {
    const userId = await this.getUserId(firebaseUid);
    const device = await this.prisma.device.findFirst({
      where: { id: deviceId, userId },
    });
    if (!device) throw new NotFoundException('Device not found');
    return {
      batteryState: device.batteryState,
      batteryPercentage: device.batteryPercentage,
      syncStatus: device.syncStatus,
      firmwareVersion: device.firmwareVersion,
    };
  }

  async unpairDevice(firebaseUid: string, deviceId: string) {
    const userId = await this.getUserId(firebaseUid);
    const device = await this.prisma.device.findFirst({
      where: { id: deviceId, userId },
    });
    if (!device) throw new NotFoundException('Device not found');
    await this.prisma.device.delete({ where: { id: deviceId } });
    return { message: 'Device unpaired successfully' };
  }
}
