import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ServiceTrackService } from '../modules/service-track/service-track.service';
import { CreateServiceTrackDto } from '../modules/service-track/dto/create-service-track.dto';

async function bootstrap() {
  console.log('🔄 Starting Create Debug Script...');
  
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const serviceTrackService = app.get(ServiceTrackService);
    
    // 模拟管理员用户
    const mockAdminUser = {
      id: 'DEBUG_ADMIN_001',
      username: 'debug_admin',
      role: 'super_admin',
      storeId: 'XFL001'
    };

    // 测试 create (模拟新增操作)
    console.log('\n🧪 Testing create...');
    const createDto: CreateServiceTrackDto = {
      initiatorId: 'XFL00100008', // 确保这个ID存在
      type: 1, // 匹配反馈
      eventTime: new Date(),
      feedbackContent: { note: 'Debug create test 2' },
      storeId: 'XFL001', 
      targetId: null, // 匹配轨迹可以没有 targetId 吗？如果不选的话
      status: 1
    } as any;

    try {
      const newTrack = await serviceTrackService.create(createDto, mockAdminUser);
      console.log('✅ create Success!');
      console.log('   Created ID:', newTrack.id);
    } catch (error) {
      console.error('❌ create FAILED:', error);
      if (error.driverError) {
          console.error('   SQL Message:', error.driverError.sqlMessage);
          console.error('   SQL:', error.driverError.sql);
      }
    }

    await app.close();
    process.exit(0);

  } catch (error) {
    console.error('☠️ Fatal Error:', error);
    process.exit(1);
  }
}

bootstrap();

