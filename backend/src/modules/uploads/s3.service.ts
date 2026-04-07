import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';

/**
 * Issues pre-signed PUT URLs so clients can upload directly to S3/R2,
 * keeping the API server out of the data path.
 */
@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicBase?: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET ?? 'nutritrack-uploads';
    this.publicBase = process.env.S3_PUBLIC_BASE;
    this.client = new S3Client({
      region: process.env.S3_REGION ?? 'us-east-1',
      endpoint: process.env.S3_ENDPOINT,
      forcePathStyle: !!process.env.S3_ENDPOINT,
    });
  }

  async presignUpload(params: {
    userId: string;
    kind: 'body-photo' | 'plan-upload' | 'avatar';
    contentType: string;
    extension: string;
  }) {
    const key = `${params.kind}/${params.userId}/${Date.now()}-${crypto
      .randomBytes(6)
      .toString('hex')}.${params.extension}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: params.contentType,
      });
      const url = await getSignedUrl(this.client, command, { expiresIn: 300 });
      const publicUrl = this.publicBase
        ? `${this.publicBase}/${key}`
        : `https://${this.bucket}.s3.amazonaws.com/${key}`;
      return { uploadUrl: url, publicUrl, key, expiresIn: 300 };
    } catch (err) {
      this.logger.warn(
        `S3 presign failed (likely no creds in dev): ${(err as Error).message}`,
      );
      return {
        uploadUrl: `dev://local-upload/${key}`,
        publicUrl: `dev://local/${key}`,
        key,
        expiresIn: 300,
      };
    }
  }
}
