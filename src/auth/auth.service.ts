import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async syncUser(decodedToken: DecodedIdToken) {
    const { uid, email, phone_number } = decodedToken;

    let isNewUser = false;

    let user = await this.prisma.user.findUnique({
      where: { firebaseUid: uid },
      include: { profile: true },
    });

    if (!user) {
      isNewUser = true;
      user = await this.prisma.user.create({
        data: {
          firebaseUid: uid,
          email: email ?? null,
          phoneNumber: phone_number ?? null,
          profile: {
            create: {
              onboardingCompleted: false,
            },
          },
        },
        include: { profile: true },
      });
    } else if (!user.profile) {
      await this.prisma.userProfile.create({
        data: {
          userId: user.id,
          onboardingCompleted: false,
        },
      });
      user = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: { profile: true },
      });
    }

    return {
      user,
      profile: user!.profile,
      isNewUser,
    };
  }
}
