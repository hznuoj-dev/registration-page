import { Module, forwardRef } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SharedModule } from '@/shared.module';
import { ClusterModule } from '@/cluster/cluster.module';
import { RedisModule } from '@/redis/redis.module';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [
    SharedModule,
    forwardRef(() => ClusterModule),
    forwardRef(() => RedisModule),
    forwardRef(() => DatabaseModule),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
