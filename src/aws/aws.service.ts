import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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
      region: 'us-east-2', // Esto es suficiente
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

  async listKeys(): Promise<string[]> {
    const command = new ListObjectsV2Command({ Bucket: this.bucketName });
    const { Contents } = await this.s3.send(command);
    const res = Contents?.map((file) => file.Key!);
    return res ?? [];
  }

  /**
   * Genera una URL firmada temporal para acceder a un archivo privado en S3.
   *
   * @param fileKey - La clave (ruta dentro del bucket) del archivo en S3.
   * Ejemplo del file https://${this.bucketName}.s3.amazonaws.com/${fileKey}`
   * @returns Una URL firmada válida por 1 hora que permite acceder al archivo.
   */
  async getFileUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });
    const res = await this.s3.send(command); // Solo para verificar existencia
    console.log('Res: ', res);

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 }); // 1 hora
    return url;
  }

  /**
   * Comprueba si el archivo existe en S3.
   *
   * @param fileKey - La clave (ruta dentro del bucket) del archivo en S3.
   * Ejemplo del file https://${this.bucketName}.s3.amazonaws.com/${fileKey}`
   * @returns Una URL firmada válida por 1 hora que permite acceder al archivo.
   */
  async existsFileOnS3(fileKey: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });
    try {
      const res = await this.s3.send(command);
      if (!res) {
        return false;
      }
      return true;
    } catch (error: unknown) {
      console.error(error);
      return false;
    }
  }
}
