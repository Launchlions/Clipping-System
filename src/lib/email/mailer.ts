export type EmailEventType = 
  | 'SLOT_CLAIMED'
  | 'SUBMISSION_APPROVED'
  | 'SUBMISSION_REVISION_REQUESTED'
  | 'PAYOUT_RELEASED'
  | 'DISPUTE_FILED';

export interface EmailPayload {
  to: string;
  recipientName: string;
  eventType: EmailEventType;
  data: {
    campaignTitle: string;
    amountFormatted?: string;
    actionUrl?: string;
    notes?: string;
  };
}

export class MailerService {
  /**
   * Generates a clean HTML transactional email template matching ClipBridge design tokens.
   */
  private static renderTemplate(payload: EmailPayload): { subject: string; html: string } {
    const { recipientName, eventType, data } = payload;
    let subject = 'ClipBridge Notification';
    let headline = '';
    let bodyText = '';
    let buttonText = 'View Dashboard';

    switch (eventType) {
      case 'SLOT_CLAIMED':
        subject = `[ClipBridge] Creator locked slot for "${data.campaignTitle}"`;
        headline = 'New Creator Slot Reserved';
        bodyText = `A verified content creator has reserved a 48-hour production slot for your campaign <strong>${data.campaignTitle}</strong>. They will submit their 9:16 edit for your review shortly.`;
        buttonText = 'Review Campaign Brief';
        break;

      case 'SUBMISSION_APPROVED':
        subject = `[ClipBridge] Submission Approved for "${data.campaignTitle}"`;
        headline = 'Your Video Cut Was Approved!';
        bodyText = `The brand team has approved your video submission for <strong>${data.campaignTitle}</strong>. You may now post the video to Instagram Reels with the verified Paid Partnership tag to initiate attribution tracking.`;
        buttonText = 'Submit Live Reel Link';
        break;

      case 'SUBMISSION_REVISION_REQUESTED':
        subject = `[ClipBridge] Revisions requested on "${data.campaignTitle}"`;
        headline = 'Submission Revision Requested';
        bodyText = `The brand reviewed your video cut for <strong>${data.campaignTitle}</strong> and requested minor adjustments before publishing.<br/><br/><em>Feedback: "${data.notes || 'Please align with brand guidelines.'}"</em>`;
        buttonText = 'Upload Revised Cut';
        break;

      case 'PAYOUT_RELEASED':
        subject = `[ClipBridge] Payout Released: ${data.amountFormatted || '$0.00'}`;
        headline = 'Performance Escrow Disbursed';
        bodyText = `Congratulations! 7-day attribution tracking has concluded for your Instagram Reel on <strong>${data.campaignTitle}</strong>. Your net payout of <strong>${data.amountFormatted}</strong> has been transferred directly to your Stripe Connect bank account.`;
        buttonText = 'View Payout Statement';
        break;

      case 'DISPUTE_FILED':
        subject = `[ClipBridge] Dispute Filed for "${data.campaignTitle}"`;
        headline = 'Dispute Under Review';
        bodyText = `A dispute has been logged regarding a submission on <strong>${data.campaignTitle}</strong>. Escrow balances are securely held pending administrator arbitration.`;
        buttonText = 'Inspect Dispute Case';
        break;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAFAF9; margin: 0; padding: 32px 16px; color: #18181B;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 8px; overflow: hidden;">
    <tr>
      <td style="padding: 24px 32px; background-color: #111214; border-bottom: 1px solid #27272A;">
        <span style="font-size: 16px; font-weight: bold; color: #FFFFFF; letter-spacing: -0.5px;">ClipBridge</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #18181B; margin: 0 0 16px 0;">${headline}</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #3F3F46; margin: 0 0 24px 0;">Hello ${recipientName},</p>
        <p style="font-size: 14px; line-height: 1.6; color: #3F3F46; margin: 0 0 32px 0;">${bodyText}</p>
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td style="border-radius: 6px; background-color: #0D7377;">
              <a href="${data.actionUrl || 'https://clipbridge.vercel.app'}" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 13px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 6px;">
                ${buttonText} &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 32px; background-color: #F5F5F4; border-top: 1px solid #E4E4E7; font-size: 12px; color: #71717A;">
        <span>ClipBridge Protocol Inc. &bull; Financial-grade creator escrow custody.</span>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    return { subject, html };
  }

  /**
   * Sends transactional email using Resend API or graceful console log in staging/test environments.
   */
  static async send(payload: EmailPayload): Promise<{ success: boolean; messageId?: string }> {
    const { subject, html } = this.renderTemplate(payload);
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.log(`[MAILER SIMULATION] To: ${payload.to} | Subject: ${subject}`);
      return { success: true, messageId: `sim_${Date.now()}` };
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'ClipBridge <noreply@clipbridge.com>',
          to: payload.to,
          subject,
          html,
        }),
      });

      const json = await res.json();
      return { success: res.ok, messageId: json.id };
    } catch (err: any) {
      console.error('Failed to send transactional email:', err);
      return { success: false };
    }
  }
}
