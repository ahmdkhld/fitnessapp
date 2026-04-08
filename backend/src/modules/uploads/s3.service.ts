import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
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

  /** Maximum upload size in bytes (10 MB). */
  private readonly MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

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
        ContentLength: this.MAX_UPLOAD_BYTES,
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

  /**
   * Generate a presigned GET URL so the client can download a private object.
   */
  async presignDownload(key: string): Promise<{ downloadUrl: string }> {
    await this.assertObjectExists(key);

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      const downloadUrl = await getSignedUrl(this.client, command, {
        expiresIn: 900, // 15 minutes
      });
      return { downloadUrl };
    } catch (err) {
      this.logger.warn(
        `S3 presign-download failed (likely no creds in dev): ${(err as Error).message}`,
      );
      return { downloadUrl: `dev://local-download/${key}` };
    }
  }

  /**
   * Delete an object from S3.
   */
  async deleteObject(key: string): Promise<void> {
    await this.assertObjectExists(key);

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.client.send(command);
    } catch (err) {
      this.logger.warn(
        `S3 delete failed (likely no creds in dev): ${(err as Error).message}`,
      );
    }
  }

  /**
   * Verify that an object exists in the bucket. Throws 404 if it does not.
   */
  private async assertObjectExists(key: string): Promise<void> {
    try {
      await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
    } catch (err: any) {
      // HeadObject returns 404 / NotFound when the key is missing
      if (
        err?.name === 'NotFound' ||
        err?.$metadata?.httpStatusCode === 404
      ) {
        throw new NotFoundException(`Object not found: ${key}`);
      }
      // In dev without real S3 credentials, log and let the caller proceed
      this.logger.warn(
        `HeadObject check failed (likely no creds in dev): ${(err as Error).message}`,
      );
    }
  }
}
