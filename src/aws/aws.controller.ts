import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from './aws.service';
@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return { imageUrl: await this.awsService.uploadFile(file) };
  }

  @Get('list')
  async listFiles() {
    return { images: await this.awsService.listFiles() };
  }

  @Get('file/:key')
  async getFile(@Param('key') key: string) {
    return { imageUrl: await this.awsService.getFileUrl(key) };
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.awsService.remove(id);
  // }
}
