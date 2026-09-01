import { TrackingProvider, VerificationResult, PostMetrics } from './interface';

export class SubmissionBasedTrackingProvider implements TrackingProvider {
  async verifyPostExists(url: string): Promise<VerificationResult> {
    const isInstagram = url.includes('instagram.com/reel/') || url.includes('instagram.com/p/');
    if (!isInstagram) {
      return {
        isValid: false,
        errorMessage: 'URL must be a valid Instagram Reel or Post link',
      };
    }

    const regex = /instagram\.com\/(?:reel|p)\/([A-Za-z0-9_-]+)/;
    const match = url.match(regex);
    const postId = match ? match[1] : `post_${Date.now()}`;

    return {
      isValid: true,
      postId,
      creatorHandle: 'verified_creator',
    };
  }

  async fetchMetrics(postIdOrUrl: string): Promise<PostMetrics> {
    // Simulated metric polling during attribution window
    const baseViews = 15000 + Math.floor(Math.random() * 45000);
    const likes = Math.floor(baseViews * 0.08);
    const comments = Math.floor(likes * 0.05);
    const shares = Math.floor(likes * 0.12);

    return {
      views: baseViews,
      likes,
      comments,
      shares,
      timestamp: new Date(),
    };
  }
}
