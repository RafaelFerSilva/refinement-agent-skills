import type { SqlClient } from './alert-evaluator.ts';
import type { Actor, Role, ServiceResult } from './alert-service.ts';

export const REPORT_READER_ROLES: readonly Role[] = ['dispatch_operator', 'operations_director'];

export interface VehicleDailyConsolidation {
  vehicle_id: string;
  plate: string;
  reading_count: number;
  max_speed_kmh: number | null;
}

export async function buildDailyOperationalReport(
  db: SqlClient,
  dayStartIso: string,
  dayEndIso: string,
  actor: Actor,
): Promise<ServiceResult<VehicleDailyConsolidation[]>> {
  if (!REPORT_READER_ROLES.includes(actor.role)) {
    return { status: 403, error: 'Operational report access denied' };
  }
  const result = await db.query<VehicleDailyConsolidation>(
    `SELECT v.id AS vehicle_id,
            v.plate,
            COUNT(r.id)::int AS reading_count,
            MAX(r.speed_kmh) AS max_speed_kmh
     FROM vehicles v
     LEFT JOIN readings r
       ON r.vehicle_id = v.id
      AND r.recorded_at >= $1
      AND r.recorded_at < $2
     GROUP BY v.id, v.plate
     ORDER BY v.plate`,
    [dayStartIso, dayEndIso],
  );
  return { status: 200, body: result.rows };
}
