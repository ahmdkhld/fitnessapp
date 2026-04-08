import { NotFoundException } from '@nestjs/common';

// Mock the AWS SDK modules before importing S3Service
const mockSend = jest.fn();
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: mockSend })),
  PutObjectCommand: jest.fn().mockImplementation((input) => ({ input })),
  GetObjectCommand: jest.fn().mockImplementation((input) => ({ input })),
  DeleteObjectCommand: jest.fn().mockImplementation((input) => ({ input })),
  HeadObjectCommand: jest.fn().mockImplementation((input) => ({ input })),
}));

const mockGetSignedUrl = jest.fn();
jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: mockGetSignedUrl,
}));

import { S3Service } from './s3.service';

describe('S3Service', () => {
  let svc: S3Service;

  beforeEach(() => {
    jest.clearAllMocks();
    // HeadObject succeeds by default (object exists)
    mockSend.mockResolvedValue({});
    svc = new S3Service();
  });

  describe('presignUpload', () => {
    it('returns a signed upload URL with the correct key structure', async () => {
      mockGetSignedUrl.mockResolvedValue('https://s3.example.com/signed-put');

      const result = await svc.presignUpload({
        userId: 'u1',
        kind: 'body-photo',
        contentType: 'image/jpeg',
        extension: 'jpg',
      });

      expect(result.uploadUrl).toBe('https://s3.example.com/signed-put');
      expect(result.key).toMatch(/^body-photo\/u1\/\d+-[a-f0-9]+\.jpg$/);
      expect(result.expiresIn).toBe(300);
      expect(result.publicUrl).toBeDefined();
    });

    it('falls back to dev:// URLs when S3 credentials fail', async () => {
      mockGetSignedUrl.mockRejectedValue(new Error('No credentials'));

      const result = await svc.presignUpload({
        userId: 'u1',
        kind: 'avatar',
        contentType: 'image/png',
        extension: 'png',
      });

      expect(result.uploadUrl).toMatch(/^dev:\/\/local-upload\//);
      expect(result.publicUrl).toMatch(/^dev:\/\/local\//);
      expect(result.key).toMatch(/^avatar\/u1\//);
    });
  });

  describe('presignDownload', () => {
    it('returns a signed download URL for an existing object', async () => {
      mockGetSignedUrl.mockResolvedValue('https://s3.example.com/signed-get');

      const result = await svc.presignDownload('body-photo/u1/file.jpg');

      expect(result.downloadUrl).toBe('https://s3.example.com/signed-get');
    });

    it('throws NotFoundException when the object does not exist', async () => {
      mockSend.mockRejectedValue({ name: 'NotFound', $metadata: { httpStatusCode: 404 } });

      await expect(
        svc.presignDownload('missing/key.jpg'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('deleteObject', () => {
    it('sends a DeleteObjectCommand for an existing object', async () => {
      // First call: HeadObject succeeds, Second call: DeleteObject succeeds
      mockSend.mockResolvedValue({});

      await svc.deleteObject('body-photo/u1/file.jpg');

      // HeadObject + DeleteObject = 2 calls
      expect(mockSend).toHaveBeenCalledTimes(2);
    });

    it('throws NotFoundException when trying to delete a non-existent object', async () => {
      mockSend.mockRejectedValue({ name: 'NotFound', $metadata: { httpStatusCode: 404 } });

      await expect(
        svc.deleteObject('missing/key.jpg'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
