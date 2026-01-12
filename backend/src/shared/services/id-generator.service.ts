import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

/**
 * ID生成器服务
 * 实现PRD中定义的ID生成规则：
 * - 门店ID: XFL + 3位序列号
 * - 前台用户ID: 门店ID + 5位序列号（带混淆）
 * - 后台用户ID: 门店ID + G + 5位序列号（带混淆）
 */
@Injectable()
export class IdGeneratorService implements OnModuleInit {
  private redisClient: any;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // 初始化Redis客户端
    this.redisClient = createClient({
      url: `redis://${this.configService.get('REDIS_HOST', 'localhost')}:${this.configService.get('REDIS_PORT', 6379)}`,
      password: this.configService.get('REDIS_PASSWORD') || undefined,
      database: this.configService.get('REDIS_DB', 0),
    });

    await this.redisClient.connect();
    console.log('✅ Redis连接成功（ID生成器）');
  }

  /**
   * 生成门店ID
   * 格式: XFL + 3位序列号
   * 示例: XFL001, XFL002
   */
  async generateStoreId(): Promise<string> {
    const key = 'sys:store:seq';
    const seq = await this.redisClient.incr(key);
    const paddedSeq = String(seq).padStart(3, '0');
    return `XFL${paddedSeq}`;
  }

  /**
   * 生成前台用户ID
   * 格式: 门店ID + 5位序列号（混淆）
   * 示例: XFL00100030
   */
  async generateAppUserId(storeId: string): Promise<string> {
    const key = `sys:user:seq:${storeId}`;
    const seq = await this.redisClient.incr(key);
    
    // 使用线性同余生成器混淆序列号，避免连续
    const obfuscatedSeq = this.obfuscateSequence(seq);
    const paddedSeq = String(obfuscatedSeq).padStart(5, '0');
    
    return `${storeId}${paddedSeq}`;
  }

  /**
   * 生成后台用户ID
   * 格式: 门店ID + G + 5位序列号（混淆）
   * 示例: XFL001G13702
   */
  async generateSysUserId(storeId: string): Promise<string> {
    const key = `sys:backend:seq:${storeId}`;
    const seq = await this.redisClient.incr(key);
    
    const obfuscatedSeq = this.obfuscateSequence(seq);
    const paddedSeq = String(obfuscatedSeq).padStart(5, '0');
    
    return `${storeId}G${paddedSeq}`;
  }

  /**
   * 序列号混淆算法（线性同余生成器）
   * 将连续的序列号映射为伪随机但唯一的数字
   * 范围: 1-99999
   */
  private obfuscateSequence(seq: number): number {
    // LCG参数 (a, c, m)
    const a = 16807;
    const c = 0;
    const m = 99999;
    
    // 计算: (a * seq + c) % m
    let result = (a * seq + c) % m;
    
    // 确保结果在1-99999范围内
    if (result === 0) result = 1;
    
    return result;
  }

  /**
   * 获取当前序列号（用于调试）
   */
  async getCurrentSequence(key: string): Promise<number> {
    const value = await this.redisClient.get(key);
    return value ? parseInt(value) : 0;
  }

  /**
   * 重置序列号（谨慎使用）
   */
  async resetSequence(key: string): Promise<void> {
    await this.redisClient.set(key, 0);
  }
}

