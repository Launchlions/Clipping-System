import { TrackingProvider } from './interface';
import { SubmissionBasedTrackingProvider } from './submission-based';
import { InstagramApiTrackingProvider } from './instagram-api';

export function getTrackingProvider(strategy: 'submission' | 'direct_api' = 'submission'): TrackingProvider {
  if (strategy === 'direct_api') {
    return new InstagramApiTrackingProvider();
  }
  return new SubmissionBasedTrackingProvider();
}
