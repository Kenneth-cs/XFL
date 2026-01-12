import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OssService } from '../../shared/services/oss.service';
import { CurrentUser, CurrentUserData } from '../../common/decorators';

@Controller('upload')
export class UploadController {
  constructor(private readonly ossService: OssService) {}

  /**
   * 上传图片（头像等）
   */
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: any,
    @CurrentUser() user: CurrentUserData,
  ) {
    if (!file) {
      throw new BadRequestException('请选择要上传的文件');
    }

    // 验证文件类型
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('只支持上传 JPG、PNG、GIF 格式的图片');
    }

    // 验证文件大小（最大5MB）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('图片大小不能超过5MB');
    }

    // 生成文件名并上传
    const fileName = this.ossService.generateFileName(file.originalname, user.userId);
    const url = await this.ossService.upload(file.buffer, fileName);

    return {
      url,
      fileName,
    };
  }
}

