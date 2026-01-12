import { Module, Global } from '@nestjs/common';
import { RedisService } from './services/redis.service';
import { IdGeneratorService } from './services/id-generator.service';
import { OssService } from './services/oss.service';

@Global()
@Module({
  providers: [RedisService, IdGeneratorService, OssService],
  exports: [RedisService, IdGeneratorService, OssService],
})
export class SharedModule {}

