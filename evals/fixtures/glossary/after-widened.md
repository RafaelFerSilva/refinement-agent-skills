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
The daily consolidation of readings per vehicle, consumed by the dispatch operator and the operations director. It also carries alert markers over that period, including whether the vehicle was silenced and when: a silenced hour must not read as an hour with no speeding.
_Avoid_: dashboard, statement

**Real time**:
Term with no agreed latency. Every occurrence requires an SLA to confirm with the operations director.
_Avoid_: instant, online

**Speed alert**:
The pop-up and sound the dispatch panel triggers for a vehicle that is speeding. One of possibly several alert types a vehicle can raise; this is the only one covered by silencing, other alert types on the same vehicle keep firing independently.
_Avoid_: alert (alone, when the type matters)

**Dispatch panel**:
The dispatch operator's working screen: where speed alerts pop up and sound, and where a silenced vehicle shows who silenced it and until when. Only the dispatch operator works from it, the operations director and device technician have no reason to.
_Avoid_: dashboard (the operational report is the daily consolidation; the panel is the live operator screen)

**Silence (a vehicle's speed alert)**:
A dispatch operator suppresses the pop-up and sound of one vehicle's speed alert, for 15, 30, or 60 minutes (30 is the default). It is shared: it applies to the whole dispatch team, not only to the operator who triggered it, so the alert keeps being recorded and still appears, marked as silenced, in the operational report. Any dispatch operator on shift may end it early; otherwise it ends on its own when the chosen time elapses, with no notification to anyone.
_Avoid_: mute, snooze
