import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { FileInfo } from 'src/shared/entity/file.entity';

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

  async uploadFile(
    file: Express.Multer.File,
    dir: string = '',
  ): Promise<string> {
    if (dir.length > 0 && dir[dir.length - 1] !== '/') {
      dir = '/';
    }

    const key = `${dir}${file.originalname}`;

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3.send(new PutObjectCommand(params));
    return `https://${this.bucketName}.s3.amazonaws.com/${params.Key}`;
  }

  async uploadBase64Image(
    base64: string,
    dir: string = '',
    prefixFilename: string = '',
  ): Promise<FileInfo> {
    // Extraer MIME type y base64 limpio
    const matches = base64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error('Invalid base64 string');

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    if (dir.length > 0 && dir[dir.length - 1] !== '/') {
      dir += '/';
    }

    const fileExtension = mimeType.split('/')[1];
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = dir + prefixFilename + fileName;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      // ACL: 'public-read',
    });

    await this.s3.send(command);
    const data: FileInfo = {
      key,
      url: `https://${this.bucketName}.s3.amazonaws.com/${key}`,
    };
    return data;
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
    // const res = await this.s3.send(command); // Solo para verificar existencia
    // console.log('Res: ', res);

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 }); // 1 hora
    return url;
  }

  async getDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ResponseContentDisposition: 'attachment', // <- force download
    });

    return await getSignedUrl(this.s3, command, { expiresIn: 3600 });
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

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3.send(command);
  }

  async deleteFiles(keys: string[]): Promise<void> {
    if (keys.length === 0) return;

    const command = new DeleteObjectsCommand({
      Bucket: process.env.AWS_BUCKET,
      Delete: {
        Objects: keys.map((key: string) => ({ Key: key })),
        Quiet: false, // dont show details
      },
    });

    await this.s3.send(command);
  }

  /**
   * Genera una URL firmada para subir un archivo a S3.
   *
   * @param fileName - Nombre del archivo a subir.
   * @param fileType - Tipo de contenido del archivo (ej. 'image/jpeg').
   * @returns URL firmada para subir el archivo.
   */
  async generatePresignedUrl(
    fileName: string,
    fileType: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: fileName,
      ContentType: fileType,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 300 }); // 5 minutos
    return url;
  }
}
