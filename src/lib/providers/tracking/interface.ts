export interface VerificationResult {
  isValid: boolean;
  postId?: string;
  creatorHandle?: string;
  errorMessage?: string;
}

export interface PostMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  timestamp: Date;
}

export interface TrackingProvider {
  verifyPostExists(url: string): Promise<VerificationResult>;
  fetchMetrics(postIdOrUrl: string): Promise<PostMetrics>;
}
