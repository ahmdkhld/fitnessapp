import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { S3Service } from './s3.service';

class PresignDto {
  @IsIn(['body-photo', 'plan-upload', 'avatar'])
  kind!: 'body-photo' | 'plan-upload' | 'avatar';

  @IsString()
  contentType!: string;

  @IsString()
  extension!: string;
}

@ApiTags('uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
}
