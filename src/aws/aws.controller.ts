import {
  Body,
  Controller,
  Delete,
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

  @Get('file/download/:key')
  async getDownloadFileUrl(@Param('key') key: string) {
    return { imageUrl: await this.awsService.getDownloadUrl(key) };
  }

  @Get('file/:key')
  async getFile(@Param('key') key: string) {
    return { imageUrl: await this.awsService.getFileUrl(key) };
  }

  @Get('file')
  async findAllFiles() {
    return await this.awsService.listKeys();
  }

  @Delete(':id')
  remove(@Param('id') key: string) {
    return this.awsService.deleteFile(key);
  }
}
