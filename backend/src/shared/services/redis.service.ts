import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

/**
 * Redis服务
 * 提供通用的Redis操作方法
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: any;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.client = createClient({
      url: `redis://${this.configService.get('REDIS_HOST', 'localhost')}:${this.configService.get('REDIS_PORT', 6379)}`,
      password: this.configService.get('REDIS_PASSWORD') || undefined,
      database: this.configService.get('REDIS_DB', 0),
    });

    this.client.on('error', (err: any) => {
      console.error('Redis Client Error', err);
    });

    await this.client.connect();
    console.log('✅ Redis连接成功');
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient() {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }
}

