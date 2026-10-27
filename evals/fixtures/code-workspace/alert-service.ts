import type { SqlClient } from './alert-evaluator.ts';

export type Role = 'dispatch_operator' | 'operations_director' | 'device_technician';

export interface Actor {
  id: string;
  role: Role;
}

export const CLOSE_REASONS = ['driver contacted', 'false positive', 'vehicle stopped'] as const;
export type CloseReason = (typeof CLOSE_REASONS)[number];

export interface AlertRow {
  id: string;
  vehicle_id: string;
  reading_id: string;
  alert_type: 'speed' | 'geofence';
  speed_kmh: number | null;
  threshold_kmh: number | null;
  occurred_at: string;
  status: 'active' | 'closed';
  close_reason: CloseReason | null;
  closed_by: string | null;
  closed_at: string | null;
}

export type ServiceResult<T> =
  | { status: 200; body: T }
  | { status: 400 | 403 | 404; error: string };

export async function listActiveAlerts(db: SqlClient, actor: Actor): Promise<ServiceResult<AlertRow[]>> {
  if (actor.role !== 'dispatch_operator') {
    return { status: 403, error: 'Dispatch operator role required' };
  }
  const result = await db.query<AlertRow>(
    `SELECT * FROM alerts WHERE status = 'active' ORDER BY occurred_at DESC`,
  );
  return { status: 200, body: result.rows };
}

export async function closeAlert(
  db: SqlClient,
  alertId: string,
  actor: Actor,
  reason: string | undefined,
): Promise<ServiceResult<AlertRow>> {
  if (actor.role !== 'dispatch_operator') {
    return { status: 403, error: 'Dispatch operator role required' };
  }
  if (!reason || !reason.trim()) {
    return { status: 400, error: 'Close reason is mandatory' };
  }
  if (!(CLOSE_REASONS as readonly string[]).includes(reason)) {
    return { status: 400, error: 'Unsupported close reason' };
  }
  const updated = await db.query<AlertRow>(
    `UPDATE alerts
     SET status = 'closed', close_reason = $2, closed_by = $3, closed_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [alertId, reason, actor.id],
  );
  if (!updated.rows[0]) {
    return { status: 404, error: 'Alert not found' };
  }
  return { status: 200, body: updated.rows[0] };
}
