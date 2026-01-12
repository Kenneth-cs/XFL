import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as COS from 'cos-nodejs-sdk-v5';

/**
 * 腾讯云COS对象存储服务
 */
@Injectable()
export class OssService {
  private cosClient: COS;
  private bucket: string;
  private region: string;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get<string>('COS_BUCKET');
    this.region = this.configService.get<string>('COS_REGION');

    this.cosClient = new COS({
      SecretId: this.configService.get<string>('COS_SECRET_ID'),
      SecretKey: this.configService.get<string>('COS_SECRET_KEY'),
    });
  }

  /**
   * 上传文件
   * @param file 文件Buffer
   * @param key 存储路径（如: avatars/user123.jpg）
   */
  async upload(file: Buffer, key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.cosClient.putObject(
        {
          Bucket: this.bucket,
          Region: this.region,
          Key: key,
          Body: file,
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            // 返回文件的访问URL
            const url = `https://${this.bucket}.cos.${this.region}.myqcloud.com/${key}`;
            resolve(url);
          }
        },
      );
    });
  }

  /**
   * 删除文件
   */
  async delete(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cosClient.deleteObject(
        {
          Bucket: this.bucket,
          Region: this.region,
          Key: key,
        },
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  /**
   * 获取文件临时访问URL（用于私有文件）
   */
  async getSignedUrl(key: string, expires = 3600): Promise<string> {
    return new Promise((resolve, reject) => {
      this.cosClient.getObjectUrl(
        {
          Bucket: this.bucket,
          Region: this.region,
          Key: key,
          Sign: true,
          Expires: expires,
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.Url);
          }
        },
      );
    });
  }

  /**
   * 生成唯一的文件名
   */
  generateFileName(originalName: string, userId: string): string {
    const ext = originalName.split('.').pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `avatars/${userId}_${timestamp}_${random}.${ext}`;
  }
}

