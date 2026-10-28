# RouteWise Operations Manual (v1.4, Legacy Reference)

Internal reference sheet from the initial fleet rollout. Fictional material used only for testing this package.

## 1. Overview and Daily Users

RouteWise monitors commercial delivery vehicles on active routes so headquarters can react to highway incidents and review daily mileage.

Three profiles access the platform today:
- **Dispatch operator** (also referred to in older training slides as **Control room agent**): monitors active alerts during shift hours and phones the driver when a violation is detected.
- **Operations director**: reviews the daily operational report across vehicles and sets annual safety targets. Does not close individual alerts.
- **Device technician**: registers and swaps embedded units on trucks.

## 2. Embedded Hardware and Telemetry

Each vehicle carries a **Tracker** (called **GPS box** in the procurement sheet), either model `RT-100` or `RT-300`. Every 30 seconds the unit sends a reading with position, speed, and capture timestamp through the external **TeleTrack** HTTPS webhook gateway. When a truck crosses a dead zone without cellular coverage, buffered readings arrive retroactively once signal returns; maximum webhook replay batch size and duplicate-reading handling are managed by the backend team and are not documented here.

Older `RT-100` units omit battery percentage and accelerometer data.

## 3. Alerting and Reports in Production

- **Speed alert:** according to the 2024 rollout memo, an alert opens automatically whenever a vehicle reading exceeds 100 km/h. Only the control room agent / dispatch operator closes active alerts, selecting a mandatory reason.
- **Geofence alert:** planned during phase 1; current production status is unclear in this manual.
- **Operational report:** daily per-vehicle summary consolidating reading count and peak speed. Some regional managers asked whether closed alerts also appear in this report.
- **SAP billing export:** mentioned in finance onboarding notes as a nightly mileage feed, though no API contract, retry policy, or confirmation of production activation exists in operations folders.
