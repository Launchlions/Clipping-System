import { generateIdempotencyKey } from '../utils/idempotency';

export interface AuditLogEntry {
  id: string;
  entityType: 'CAMPAIGN' | 'TRANSACTION' | 'PAYOUT' | 'SUBMISSION' | 'USER';
  entityId: string;
  action: string;
  actorId?: string;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

// Immutable in-memory store for dev/testing when DB is detached, backed by schema.auditLogs
const memoryAuditLogs: AuditLogEntry[] = [];

export class AuditService {
  static async log(entry: Omit<AuditLogEntry, 'id' | 'createdAt'>): Promise<AuditLogEntry> {
    const record: AuditLogEntry = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date(),
    };

    memoryAuditLogs.push(record);
    console.log(`[AUDIT LOG] ${record.entityType}:${record.entityId} -> ${record.action} by ${record.actorId || 'SYSTEM'}`);
    return record;
  }

  static async getLogsForEntity(entityType: string, entityId: string): Promise<AuditLogEntry[]> {
    return memoryAuditLogs.filter(l => l.entityType === entityType && l.entityId === entityId);
  }

  static async getAllLogs(): Promise<AuditLogEntry[]> {
    return [...memoryAuditLogs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
