import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/config';

export const dynamic = 'force-dynamic';

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ESCROW';
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

const notificationsStore: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Welcome to ClipBridge Beta',
    message: 'Your account is configured. Explore the creator marketplace or launch your first campaign.',
    type: 'SUCCESS',
    actionUrl: '/brand/dashboard',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({
    data: notificationsStore,
    unreadCount: notificationsStore.filter((n) => !n.isRead).length,
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { notificationId } = body;

    if (notificationId === 'ALL') {
      notificationsStore.forEach((n) => (n.isRead = true));
    } else if (notificationId) {
      const found = notificationsStore.find((n) => n.id === notificationId);
      if (found) found.isRead = true;
    }

    return NextResponse.json({ success: true, unreadCount: notificationsStore.filter((n) => !n.isRead).length });
  } catch {
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
