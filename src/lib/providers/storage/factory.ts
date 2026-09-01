import { StorageProvider } from './interface';
import { S3StorageProvider } from './s3';

let storageProviderInstance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!storageProviderInstance) {
    storageProviderInstance = new S3StorageProvider();
  }
  return storageProviderInstance;
}
