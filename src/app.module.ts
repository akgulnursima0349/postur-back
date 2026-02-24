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

    const serviceAccountPath = path.resolve(
      process.cwd(),
      'firebase-service-account.json',
    );

    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(
        fs.readFileSync(serviceAccountPath, 'utf8'),
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
      this.logger.log(
        `Firebase initialized with service account for project: ${serviceAccount.project_id}`,
      );
    } else {
      this.logger.warn(
        'firebase-service-account.json not found. Firebase auth will not work.',
      );
      admin.initializeApp({ projectId: 'placeholder-project' });
    }
  }
}
