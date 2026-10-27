export const SPEED_ALERT_THRESHOLD_KMH = 110;

export const TRACKER_CAPABILITIES = {
  'RT-100': { battery: false, accelerometer: false },
  'RT-300': { battery: true, accelerometer: true },
} as const;

export type TrackerModel = keyof typeof TRACKER_CAPABILITIES;

export interface ReadingInput {
  id: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  speedKmh: number;
  batteryPct: number | null;
  accelG: number | null;
  recordedAt: string;
}

export interface SqlClient {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>;
}

export async function ingestReading(db: SqlClient, reading: ReadingInput, receivedAt: string): Promise<void> {
  await db.query(
    `INSERT INTO readings (id, vehicle_id, latitude, longitude, speed_kmh, battery_pct, accel_g, recorded_at, received_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      reading.id,
      reading.vehicleId,
      reading.latitude,
      reading.longitude,
      reading.speedKmh,
      reading.batteryPct,
      reading.accelG,
      reading.recordedAt,
      receivedAt,
    ],
  );

  if (reading.speedKmh > SPEED_ALERT_THRESHOLD_KMH) {
    await db.query(
      `INSERT INTO alerts (id, vehicle_id, reading_id, alert_type, speed_kmh, threshold_kmh, occurred_at, status)
       VALUES (gen_random_uuid(), $1, $2, 'speed', $3, $4, $5, 'active')`,
      [reading.vehicleId, reading.id, reading.speedKmh, SPEED_ALERT_THRESHOLD_KMH, reading.recordedAt],
    );
  }
}
