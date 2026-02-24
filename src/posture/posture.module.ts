import { Module } from '@nestjs/common';
import { PostureController } from './posture.controller';
import { PostureService } from './posture.service';

@Module({
  controllers: [PostureController],
  providers: [PostureService],
})
export class PostureModule {}
