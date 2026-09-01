import { getTrackingProvider } from '../providers/tracking/factory';
import { AuditService } from './audit.service';
import { ValidationError } from '../utils/errors';

export interface RegisterTrackedLinkParams {
  submissionId: string;
  liveUrl: string;
  platform?: string;
  attributionWindowDays?: number;
  actorId: string;
}

export class TrackingService {
  static async verifyAndStartTracking(params: RegisterTrackedLinkParams) {
    const trackingProvider = getTrackingProvider('submission');
    const verification = await trackingProvider.verifyPostExists(params.liveUrl);

    if (!verification.isValid) {
      throw new ValidationError(verification.errorMessage || 'Invalid post URL');
    }

    const windowDays = params.attributionWindowDays || 7;
    const now = new Date();
    const trackingEndsAt = new Date(now.getTime() + windowDays * 24 * 60 * 60 * 1000);

    const trackedRecord = {
      id: `trk_${Date.now()}`,
      submissionId: params.submissionId,
      liveUrl: params.liveUrl,
      platform: params.platform || 'instagram',
      postId: verification.postId,
      status: 'TRACKING' as const,
      verifiedAt: now,
      trackingStartedAt: now,
      trackingEndsAt,
    };

    await AuditService.log({
      entityType: 'SUBMISSION',
      entityId: params.submissionId,
      action: 'LIVE_LINK_VERIFIED_AND_TRACKING_STARTED',
      actorId: params.actorId,
      newState: trackedRecord,
    });

    return trackedRecord;
  }

  static async fetchLatestSnapshot(postId: string) {
    const provider = getTrackingProvider('submission');
    return await provider.fetchMetrics(postId);
  }
}
