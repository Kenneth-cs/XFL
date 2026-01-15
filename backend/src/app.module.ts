import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 导入业务模块
import { AuthModule } from './modules/auth/auth.module';
import { StoreModule } from './modules/store/store.module';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { UploadModule } from './modules/upload/upload.module';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { MvModule } from './modules/mv/mv.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM数据库连接
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // 生产环境必须设为false
        logging: true, // 强制开启日志
        timezone: '+08:00',
        charset: 'utf8mb4',
      }),
    }),

    // 共享模块（Redis、ID生成器等）
    SharedModule,

    // 业务模块
    AuthModule,
    StoreModule,
    UserModule,
    ProfileModule,
    UploadModule,
    AssessmentModule,
    MvModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

