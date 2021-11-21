import {
  Module,
  forwardRef,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthMiddleware } from '@/auth/auth.middleware';

import { SharedModule } from '@/shared.module';
import { ClusterModule } from '@/cluster/cluster.module';
import { RedisModule } from '@/redis/redis.module';
import { DatabaseModule } from '@/database/database.module';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { RegistrationModule } from '@/registration/registration.module';
import { EventReportModule } from '@/event-report/event-report.module';

@Module({
  imports: [
    SharedModule,
    forwardRef(() => ClusterModule),
    forwardRef(() => RedisModule),
    forwardRef(() => DatabaseModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => RegistrationModule),
    forwardRef(() => EventReportModule),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
