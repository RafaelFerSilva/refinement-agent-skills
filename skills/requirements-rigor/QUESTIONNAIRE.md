# Questionnaire Format

Used for open questions with recipients outside the refinement session. One file per recipient, written alongside the generating artifact: `questionnaire-<recipient>.md` (or `questionario-<destinatario>.md`). Questions target what the recipient knows and the PO does not.

```md
# Questionnaire: <topic>

**To:** <recipient and role> | **From:** <session lead; if unknown, `[TO DEFINE: name]`> | **Suggested deadline:** <date or "when possible">
**Why:** <the decision depending on these answers and what is blocked until they arrive>
**How to answer:** <estimated effort in minutes>. Partial answers and "don't know" are helpful; flag uncertainty instead of skipping.

## Context

<One paragraph orienting someone who was not in the session. Enough to answer well, no more.>

## <Topic>

### <Question, single focused idea>

_Why it matters: <one line, only when the question could be misread or receive a shallow response>_

>

## Anything else?

Anything we did not ask that we should know?
```

Order: highest priority first, because an asynchronous response may happen in a single pass. One question per item; group under topic headings when there are five or more questions. When generated, link the file from the open questions section of the main artifact. The questionnaire goes outside the session, often outside the team: it does not carry `Status:` or the final artifact disclaimer.
