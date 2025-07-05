import {
  Controller,
  Post,
  Delete,
  Get,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('S3 Storage')
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload single file to S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folder: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const url = await this.s3Service.uploadFile(file, folder);
    return {
      message: 'File uploaded successfully',
      url,
    };
  }

  @Post('upload/multiple')
  @ApiOperation({ summary: 'Upload multiple files to S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        folder: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const urls = await this.s3Service.uploadMultipleFiles(files, folder);
    return {
      message: 'Files uploaded successfully',
      urls,
    };
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete file from S3' })
  async deleteFile(@Query('url') fileUrl: string) {
    if (!fileUrl) {
      throw new BadRequestException('File URL is required');
    }

    await this.s3Service.deleteFile(fileUrl);
    return {
      message: 'File deleted successfully',
    };
  }

  @Delete('delete/multiple')
  @ApiOperation({ summary: 'Delete multiple files from S3' })
  async deleteMultipleFiles(@Query('urls') fileUrls: string[]) {
    if (!fileUrls || fileUrls.length === 0) {
      throw new BadRequestException('File URLs are required');
    }

    await this.s3Service.deleteMultipleFiles(fileUrls);
    return {
      message: 'Files deleted successfully',
    };
  }

  @Get('presigned-url')
  @ApiOperation({ summary: 'Get presigned URL for file download' })
  async getPresignedUrl(
    @Query('fileName') fileName: string,
    @Query('folder') folder?: string,
    @Query('expireTime') expireTime?: number
  ) {
    if (!fileName) {
      throw new BadRequestException('File name is required');
    }

    const url = await this.s3Service.getPresignedUrl(
      fileName,
      folder,
      expireTime
    );
    return {
      presignedUrl: url,
    };
  }

  @Get('upload-presigned-url')
  @ApiOperation({ summary: 'Get presigned URL for file upload' })
  async getUploadPresignedUrl(
    @Query('fileName') fileName: string,
    @Query('folder') folder?: string,
    @Query('expireTime') expireTime?: number
  ) {
    if (!fileName) {
      throw new BadRequestException('File name is required');
    }

    const url = await this.s3Service.uploadFileWithPresignedUrl(
      fileName,
      folder,
      expireTime
    );
    return {
      uploadUrl: url,
    };
  }

  @Get('list')
  @ApiOperation({ summary: 'List files in S3 folder' })
  async listFiles(@Query('folder') folder?: string) {
    const files = await this.s3Service.listFiles(folder);
    return {
      files,
    };
  }

  @Get('info')
  @ApiOperation({ summary: 'Get file information' })
  async getFileInfo(@Query('url') fileUrl: string) {
    if (!fileUrl) {
      throw new BadRequestException('File URL is required');
    }

    const info = await this.s3Service.getFileInfo(fileUrl);
    return {
      fileInfo: info,
    };
  }
}
