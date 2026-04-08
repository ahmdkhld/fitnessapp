import { IsEnum, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UploadKind {
  BODY_PHOTO = 'body-photo',
  PLAN_UPLOAD = 'plan-upload',
  AVATAR = 'avatar',
}

export class PresignDto {
  @ApiProperty({ enum: UploadKind, description: 'Kind of upload', example: UploadKind.AVATAR })
  @IsEnum(UploadKind)
  kind!: UploadKind;

  @ApiProperty({ description: 'MIME content type', example: 'image/jpeg' })
  @IsString()
  @Matches(/^[\w\-]+\/[\w\-+.]+$/, { message: 'contentType must be a valid MIME type' })
  contentType!: string;

  @ApiProperty({ description: 'File extension (without dot)', example: 'jpg' })
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'extension must contain only alphanumeric characters' })
  extension!: string;
}
