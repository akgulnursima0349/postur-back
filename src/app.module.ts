import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { PostureModule } from './posture/posture.module';
import { GoalsModule } from './goals/goals.module';
import { ProgressModule } from './progress/progress.module';
import { CoachModule } from './coach/coach.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    DevicesModule,
    PostureModule,
    GoalsModule,
    ProgressModule,
    CoachModule,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  onModuleInit() {
    if (admin.apps.length) return;

    let serviceAccount: admin.ServiceAccount | null = null;

    // 1. Önce env variable'dan dene (production/Render/Railway)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      // 2. Yoksa local dosyadan dene (local geliştirme)
      const serviceAccountPath = path.resolve(
        process.cwd(),
        'firebase-service-account.json',
      );
      if (fs.existsSync(serviceAccountPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      }
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: (serviceAccount as any).project_id,
      });
      this.logger.log(
        `Firebase initialized for project: ${(serviceAccount as any).project_id}`,
      );
    } else {
      this.logger.warn(
        'No Firebase credentials found. Set FIREBASE_SERVICE_ACCOUNT env variable.',
      );
      admin.initializeApp({ projectId: 'placeholder-project' });
    }
  }
}
