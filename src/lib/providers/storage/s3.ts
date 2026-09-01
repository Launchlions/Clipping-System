import { StorageProvider, UploadParams, SignedUrl, WatermarkConfig } from './interface';

export class S3StorageProvider implements StorageProvider {
  private bucket: string;
  private region: string;

  constructor() {
    this.bucket = process.env.AWS_S3_BUCKET || 'clipbridge-assets-dev';
    this.region = process.env.AWS_REGION || 'us-east-1';
  }

  async generateUploadUrl(params: UploadParams): Promise<SignedUrl> {
    const timestamp = Date.now();
    const cleanFileName = params.fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = `campaigns/${params.campaignId}/${timestamp}-${cleanFileName}`;

    // In production, this uses @aws-sdk/s3-request-presigner
    // For development/mocking without credentials:
    const uploadUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileKey}?mock-presigned=true`;

    return {
      uploadUrl,
      fileKey,
      expiresInSeconds: 900, // 15 minutes
    };
  }

  async generateDownloadUrl(fileKey: string, expirySeconds: number = 3600): Promise<string> {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileKey}?expires=${Date.now() + expirySeconds * 1000}`;
  }

  async processWatermark(sourceKey: string, config: WatermarkConfig): Promise<string> {
    // Watermarking background job handler
    const watermarkedKey = sourceKey.replace('campaigns/', 'watermarked/');
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${watermarkedKey}`;
  }
}
