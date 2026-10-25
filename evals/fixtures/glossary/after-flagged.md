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

**Alert**:
A notification the dispatch panel raises for one vehicle, as a pop-up and a sound, when a condition on that vehicle's readings is met. Comes in more than one type; the speed alert is the type this package currently names. The condition that triggers each type is an engineering decision, not recorded here [TO CONFIRM: engineering team].
_Avoid_: notification, warning, alarm

**Dispatch panel**:
The live screen where the dispatch operator watches vehicles and acts on alerts, including silencing one from the vehicle's own row, without leaving the panel.
_Avoid_: dashboard, console

**Silencing** (of an alert):
Temporarily turning off one alert type's pop-up and sound, for one vehicle, from the dispatch panel. The operator sets a duration of 15, 30 (default), or 60 minutes; the alert resumes on its own when it elapses, with no notification that it resumed. Visible to and reversible by the whole dispatch team, not only whoever silenced it. The alert itself keeps being generated underneath: silencing only stops the live notification.
_Avoid_: mute, snooze, pause

**Operational report**:
The daily consolidation of readings per vehicle, consumed by the dispatch operator and the operations director. Whether this consolidation already surfaces alert occurrences, and whether it now also needs to mark a silenced period, is open [TO CONFIRM: operations director].
_Avoid_: dashboard, statement

**Real time**:
Term with no agreed latency. Every occurrence requires an SLA to confirm with the operations director.
_Avoid_: instant, online
