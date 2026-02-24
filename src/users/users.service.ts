import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePhysicalDto } from './dto/update-physical.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private async findUserByFirebaseUid(firebaseUid: string) {
    const user = await this.prisma.user.findUnique({
      where: { firebaseUid },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getProfile(firebaseUid: string) {
    return this.findUserByFirebaseUid(firebaseUid);
  }

  async updateProfile(firebaseUid: string, dto: UpdateProfileDto) {
    const user = await this.findUserByFirebaseUid(firebaseUid);

    const profile = await this.prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        ...(dto.firstName !== undefined && { firstName: dto.firstName }),
        ...(dto.lastName !== undefined && { lastName: dto.lastName }),
        ...(dto.gender !== undefined && { gender: dto.gender }),
        ...(dto.dateOfBirth !== undefined && {
          dateOfBirth: new Date(dto.dateOfBirth),
        }),
      },
      create: {
        userId: user.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      },
    });

    return profile;
  }

  async updatePhysical(firebaseUid: string, dto: UpdatePhysicalDto) {
    const user = await this.findUserByFirebaseUid(firebaseUid);

    const profile = await this.prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        ...(dto.heightCm !== undefined && { heightCm: dto.heightCm }),
        ...(dto.weightKg !== undefined && { weightKg: dto.weightKg }),
      },
      create: {
        userId: user.id,
        heightCm: dto.heightCm,
        weightKg: dto.weightKg,
      },
    });

    return profile;
  }

  async getOnboardingStatus(firebaseUid: string) {
    const user = await this.findUserByFirebaseUid(firebaseUid);
    return {
      onboardingCompleted: user.profile?.onboardingCompleted ?? false,
      hasProfile: !!user.profile,
      hasPhysicalData: !!(user.profile?.heightCm && user.profile?.weightKg),
    };
  }
}
