import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import type { File as MulterFile } from 'multer';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PlanParserService } from './plan-parser.service';

class UploadTextDto {
  @IsString() text!: string;
}

class ConfirmDto {
  @IsOptional() @IsString() name?: string;
}

@ApiTags('plan-parser')
@ApiBearerAuth()
@Controller('plan-parser')
export class PlanParserController {
  constructor(private readonly parser: PlanParserService) {}

  @Post('upload')
  upload(@CurrentUser() user: AuthUser, @Body() dto: UploadTextDto) {
    return this.parser.uploadText(user.userId, dto.text);
  }

  @Post('upload-pdf')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  uploadPdf(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: MulterFile,
  ) {
    if (!file) throw new BadRequestException('PDF file required');
    if (!file.mimetype.includes('pdf')) {
      throw new BadRequestException('File must be a PDF');
    }
    return this.parser.uploadPdf(user.userId, file.buffer, file.originalname);
  }

  @Get(':id/result')
  result(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.parser.get(user.userId, id);
  }

  @Post(':id/confirm')
  confirm(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: ConfirmDto,
  ) {
    return this.parser.confirm(user.userId, id, dto.name ?? 'Imported plan');
  }
}
