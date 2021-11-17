import { Module, forwardRef } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { SharedModule } from '@/shared.module';
import { ClusterModule } from '@/cluster/cluster.module';

@Module({
  imports: [SharedModule, forwardRef(() => ClusterModule)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
