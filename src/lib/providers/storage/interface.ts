export interface SignedUrl {
  uploadUrl: string;
  fileKey: string;
  expiresInSeconds: number;
}

export interface UploadParams {
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  campaignId: string;
}

export interface WatermarkConfig {
  watermarkText?: string;
  watermarkImageUrl?: string;
  opacity?: number;
}

export interface StorageProvider {
  generateUploadUrl(params: UploadParams): Promise<SignedUrl>;
  generateDownloadUrl(fileKey: string, expirySeconds?: number): Promise<string>;
  processWatermark(sourceKey: string, config: WatermarkConfig): Promise<string>;
}
