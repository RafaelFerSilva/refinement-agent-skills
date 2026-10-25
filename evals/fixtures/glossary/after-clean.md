# RouteWise

Fictional logistics fleet management platform, used only as test material for this package.

## Language

**Dispatch operator**:
The person who follows vehicles on route and contacts drivers when something departs from the plan.
_Avoid_: user, dispatcher, control room

**Operations director**:
Accountable for operational results and presents them to the board. Decides what enters the MVP.
_Avoid_: manager, client

**Device technician**:
Installs and maintains the trackers on vehicles.
_Avoid_: support, field staff

**Tracker**:
The GPS device embedded in the vehicle. Older models send neither battery level nor accelerometer data.
_Avoid_: device, GPS, tracking unit

**Reading**:
One record sent by the tracker: position, speed, and timestamp. It can arrive retroactively when the tracker loses signal.
_Avoid_: ping, event, telemetry (telemetry is the set of readings, not one of them)

**Operational report**:
The daily consolidation of readings per vehicle, consumed by the dispatch operator and the operations director.
_Avoid_: dashboard, statement

**Dispatch panel**:
The live screen the dispatch operator watches, one row per vehicle. It raises the pop-up and sound for a speed alert, and is where the operator silences and later sees a vehicle's alert resume, without leaving the row. Distinct from the operational report: the panel is live, the report is the daily consolidation.
_Avoid_: dashboard, screen

**Speed alert**:
The pop-up and sound the dispatch panel raises for a vehicle whose reading exceeds its speed limit. The dispatch operator can silence it per vehicle for a chosen duration; silencing mutes the panel's pop-up and sound only, not the underlying speeding.
_Avoid_: warning, notification

**Real time**:
Term with no agreed latency. Every occurrence requires an SLA to confirm with the operations director.
_Avoid_: instant, online
