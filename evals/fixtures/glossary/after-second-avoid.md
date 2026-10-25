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
The daily consolidation of readings per vehicle, consumed by the dispatch operator and the operations director. Whether alert state belongs here is open [TO CONFIRM: operations director].
_Avoid_: dashboard, statement
_Avoid_: alert log, silence history

**Real time**:
Term with no agreed latency. Every occurrence requires an SLA to confirm with the operations director.
_Avoid_: instant, online
