import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  private s3: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    // const region = this.configService.get<string>('AWS_REGION') ?? 'us-east-2';
    const accessKeyId =
      this.configService.get<string>('AWS_ACCESS_KEY_ID') ?? '';
    const secretAccessKey =
      this.configService.get<string>('AWS_SECRET_ACCESS_KEY') ?? '';

    this.s3 = new S3Client({
      region: "us-east-2", // Esto es suficiente
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
    this.bucketName = 'uni-autonoma-sci-pro';
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: `test/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3.send(new PutObjectCommand(params));
    return `https://${this.bucketName}.s3.amazonaws.com/${params.Key}`;
  }

  async listFiles(): Promise<string[]> {
    const command = new ListObjectsV2Command({ Bucket: this.bucketName });
    const { Contents } = await this.s3.send(command);
    return (
      Contents?.map(
        (file) => `https://${this.bucketName}.s3.amazonaws.com/${file.Key}`,
      ) || []
    );
  }

  async getFileUrl(fileKey: string): Promise<string> {
    const params = { Bucket: this.bucketName, Key: fileKey };
    await this.s3.send(new GetObjectCommand(params)); // Solo para verificar existencia
    return `https://${this.bucketName}.s3.amazonaws.com/${fileKey}`;
  }
}
