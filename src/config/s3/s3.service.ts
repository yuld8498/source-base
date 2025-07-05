import { Injectable, BadRequestException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads'
  ): Promise<string> {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

      const uploadParams = {
        Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };

      const result = await this.s3.upload(uploadParams).promise();
      return result.Location;
    } catch (error) {
      throw new BadRequestException('Failed to upload file to S3');
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = 'uploads'
  ): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const key = this.extractKeyFromUrl(fileUrl);

      const deleteParams = {
        Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
        Key: key,
      };

      await this.s3.deleteObject(deleteParams).promise();
    } catch (error) {
      throw new BadRequestException('Failed to delete file from S3');
    }
  }

  async deleteMultipleFiles(fileUrls: string[]): Promise<void> {
    const deletePromises = fileUrls.map(url => this.deleteFile(url));
    await Promise.all(deletePromises);
  }

  async getPresignedUrl(
    fileName: string,
    folder: string = 'uploads',
    expireTime: number = 3600
  ): Promise<string> {
    try {
      const key = `${folder}/${fileName}`;

      const params = {
        Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
        Key: key,
        Expires: expireTime,
      };

      return this.s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      throw new BadRequestException('Failed to generate presigned URL');
    }
  }

  async uploadFileWithPresignedUrl(
    fileName: string,
    folder: string = 'uploads',
    expireTime: number = 3600
  ): Promise<string> {
    try {
      const key = `${folder}/${fileName}`;

      const params = {
        Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
        Key: key,
        Expires: expireTime,
      };

      return this.s3.getSignedUrlPromise('putObject', params);
    } catch (error) {
      throw new BadRequestException('Failed to generate upload presigned URL');
    }
  }

  private extractKeyFromUrl(url: string): string {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    const pattern = new RegExp(`https://${bucketName}.s3.*.amazonaws.com/(.+)`);
    const match = url.match(pattern);

    if (!match) {
      throw new BadRequestException('Invalid S3 URL format');
    }

    return match[1];
  }

  async listFiles(folder: string = 'uploads'): Promise<string[]> {
    try {
      const params = {
        Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
        Prefix: folder,
      };

      const result = await this.s3.listObjectsV2(params).promise();
      return result.Contents?.map(obj => obj.Key) || [];
    } catch (error) {
      throw new BadRequestException('Failed to list files from S3');
    }
  }

  async getFileInfo(fileUrl: string): Promise<any> {
    try {
      const key = this.extractKeyFromUrl(fileUrl);

      const params = {
        Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
        Key: key,
      };

      const result = await this.s3.headObject(params).promise();
      return {
        contentType: result.ContentType,
        contentLength: result.ContentLength,
        lastModified: result.LastModified,
        etag: result.ETag,
      };
    } catch (error) {
      throw new BadRequestException('Failed to get file info from S3');
    }
  }
}
