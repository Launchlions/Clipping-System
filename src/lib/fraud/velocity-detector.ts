export interface AnomalyReport {
  isSuspicious: boolean;
  riskScore: number; // 0 (legitimate) to 100 (critical fraud)
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  flags: string[];
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number; // Percentage
    viewsPerHour: number;
  };
}

export class VelocityDetector {
  /**
   * Evaluates Instagram Reel metrics snapshots to detect view-botting or artificial traffic surges.
   */
  static analyzeSnapshots(snapshots: { views: number; likes: number; comments: number; shares: number; timestamp: string }[]): AnomalyReport {
    if (!snapshots || snapshots.length === 0) {
      return {
        isSuspicious: false,
        riskScore: 0,
        riskLevel: 'LOW',
        flags: [],
        metrics: { views: 0, likes: 0, comments: 0, shares: 0, engagementRate: 0, viewsPerHour: 0 },
      };
    }

    const latest = snapshots[snapshots.length - 1];
    const first = snapshots[0];
    const totalEngagement = latest.likes + latest.comments + latest.shares;
    const engagementRate = latest.views > 0 ? (totalEngagement / latest.views) * 100 : 0;

    const hoursElapsed = Math.max(1, (new Date(latest.timestamp).getTime() - new Date(first.timestamp).getTime()) / (1000 * 60 * 60));
    const viewsPerHour = (latest.views - first.views) / hoursElapsed;

    const flags: string[] = [];
    let riskScore = 0;

    // Rule 1: Abnormally low engagement on high view count (<0.15% engagement when views > 10,000)
    if (latest.views > 10000 && engagementRate < 0.15) {
      riskScore += 45;
      flags.push(`Sub-standard engagement rate (${engagementRate.toFixed(2)}%) for high-volume view traffic`);
    }

    // Rule 2: Sudden unnatural velocity surge (>50,000 views/hour with <10 comments)
    if (viewsPerHour > 50000 && latest.comments < 10) {
      riskScore += 40;
      flags.push(`Abnormal view acquisition velocity (${Math.round(viewsPerHour).toLocaleString()} views/hr) with near-zero comment activity`);
    }

    // Rule 3: Exact 0 likes with >5,000 views
    if (latest.views > 5000 && latest.likes === 0) {
      riskScore += 50;
      flags.push('Zero likes recorded on active Reel with over 5,000 views (Automated Bot Signature)');
    }

    const clampedScore = Math.min(100, riskScore);
    const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = clampedScore >= 70 ? 'HIGH' : clampedScore >= 35 ? 'MEDIUM' : 'LOW';

    return {
      isSuspicious: clampedScore >= 35,
      riskScore: clampedScore,
      riskLevel,
      flags,
      metrics: {
        views: latest.views,
        likes: latest.likes,
        comments: latest.comments,
        shares: latest.shares,
        engagementRate: Number(engagementRate.toFixed(2)),
        viewsPerHour: Math.round(viewsPerHour),
      },
    };
  }
}
