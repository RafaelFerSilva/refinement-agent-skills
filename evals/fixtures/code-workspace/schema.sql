CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  plate TEXT NOT NULL UNIQUE,
  driver_name TEXT NOT NULL,
  tracker_model TEXT NOT NULL CHECK (tracker_model IN ('RT-100', 'RT-300')),
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE readings (
  id UUID PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  latitude NUMERIC(9, 6) NOT NULL,
  longitude NUMERIC(9, 6) NOT NULL,
  speed_kmh NUMERIC(5, 1) NOT NULL,
  battery_pct SMALLINT,
  accel_g NUMERIC(4, 2),
  recorded_at TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  reading_id UUID NOT NULL REFERENCES readings(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('speed', 'geofence')),
  speed_kmh NUMERIC(5, 1),
  threshold_kmh NUMERIC(5, 1),
  occurred_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  close_reason TEXT,
  closed_by UUID,
  closed_at TIMESTAMPTZ
);
