import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { S3Service } from './s3.service';
import { PresignDto } from './dto/presign.dto';

@ApiTags('uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadsController {
  constructor(private readonly s3: S3Service) {}

  @Post('presign')
  presign(@CurrentUser() user: AuthUser, @Body() dto: PresignDto) {
    return this.s3.presignUpload({
      userId: user.userId,
      kind: dto.kind,
      contentType: dto.contentType,
      extension: dto.extension,
    });
  }

  /**
   * Generate a presigned GET URL for downloading a file from S3.
   * The URL expires after 15 minutes.
   */
  @Get('presign-download/:key(*)')
  @ApiOkResponse({ description: 'Presigned download URL generated.' })
  @ApiNotFoundResponse({ description: 'Object not found in S3.' })
  presignDownload(@Param('key') key: string) {
    return this.s3.presignDownload(key);
  }

  /**
   * Delete a file from S3.
   */
  @Delete(':key(*)')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Object deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Object not found in S3.' })
  async deleteFile(@Param('key') key: string): Promise<void> {
    await this.s3.deleteObject(key);
  }
}
