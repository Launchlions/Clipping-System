import { TrackingProvider, VerificationResult, PostMetrics } from './interface';

export class InstagramApiTrackingProvider implements TrackingProvider {
  private appId: string;
  private appSecret: string;

  constructor() {
    this.appId = process.env.INSTAGRAM_APP_ID || '';
    this.appSecret = process.env.INSTAGRAM_APP_SECRET || '';
  }

  async verifyPostExists(url: string): Promise<VerificationResult> {
    if (!url.includes('instagram.com')) {
      return { isValid: false, errorMessage: 'Not an Instagram URL' };
    }
    return {
      isValid: true,
      postId: `ig_media_${Date.now()}`,
      creatorHandle: 'instagram_partner',
    };
  }

  async fetchMetrics(postId: string): Promise<PostMetrics> {
    // In production with live Meta Graph API:
    // GET graph.facebook.com/v19.0/{ig-media-id}/insights?metric=impressions,reach,saved,engagement
    return {
      views: 32000,
      likes: 2450,
      comments: 180,
      shares: 410,
      timestamp: new Date(),
    };
  }
}
