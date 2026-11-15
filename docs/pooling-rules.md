# HarvestRelay — Pooling Rules

> **Status: idea-stage concept.** These are proposed rules for a hackathon design. The numbers below are **sample, illustrative thresholds** picked to make the concept concrete — they are not measured truck capacities, real cold-room sizes, or figures from any pilot or partner. A real deployment would set these per actual vehicle/facility capacity and local agreement.

## 1. How a pool is formed

Every request a farmer (or her agent) submits gets grouped into a **pool** using four matching criteria, all of which must match for requests to share a pool:

1. **Village cluster** — farmers in the same local area, close enough that one truck route or one cold room is practical for all of them.
2. **Crop** — e.g. tomatoes and peppers are pooled separately, since they may need different handling.
3. **Harvest week** — requests are grouped by the week the crop will be ready, since perishable crops can't wait for a pool to fill over months.
4. **Service type** — truck pooling and cold-room pooling are separate pools, since they involve different providers and different thresholds.

So a pool is effectively identified by: `village_cluster + crop + harvest_week + service_type`.

## 2. Fill thresholds (sample/illustrative)

A pool needs to reach a minimum size before HarvestRelay invites providers to quote — small enough to be realistic for a village cluster, large enough to make a trip worthwhile for a provider.

| Service type | Sample threshold | Why (illustrative reasoning) |
|---|---|---|
| **Truck (full truckload)** | **200 crates** | A rough stand-in for "one truck's worth" of tomato/pepper crates for a local route. |
| **Cold room (minimum booking)** | **80 crates** | A rough stand-in for "worth reserving cold-room space for one cluster's harvest for the week." |

> These two numbers are **examples only**, chosen to make the design concrete for this hackathon submission. They are not derived from any measured vehicle, facility, or real-world trial, and would need to be set properly (and probably made configurable per provider) before any real use.

A pool's **status** moves through:
- `open` — still collecting requests, below threshold.
- `filled` — threshold reached; providers are invited to quote.
- `booked` — a quote has been accepted; pickup is scheduled.
- `expired` — the pool did not fill in time (see below).

## 3. What happens once a pool is filled

1. As soon as a pool's total crate count reaches its threshold, HarvestRelay marks it `filled` and invites nearby providers (matching the service type and area) to submit a **quote**: a price and a pickup day.
2. The village **agent** reviews the quote(s) that come in and accepts one on the group's behalf (or farmers vote, depending on local preference — left as a village-level decision, not dictated by the app).
3. Once a quote is accepted, every farmer in the pool gets an **SMS** with her personal cost share (her crates ÷ total pool crates × quoted price) and the pickup day, and is asked to confirm.

## 4. What happens if a pool does **not** fill in time

Perishable crops can't wait indefinitely, so every pool has a **cut-off** tied to the harvest week — for example (illustrative), a pool for a given harvest week closes for new joiners and gets evaluated **2 days before the end of that harvest week**.

If, at that cut-off, the pool is still below threshold, farmers are told **early** — not left waiting until the crop spoils — and given simple options, communicated by SMS/USSD in plain language:

- **Wait a little longer**, if the harvest week allows a short extension and the pool is close to the threshold (e.g. already at 70%+ of the sample threshold).
- **Accept a smaller/partial load** at a higher per-crate cost, if a provider is willing to run a partial trip or allow a smaller cold-room minimum.
- **Merge with a neighboring village cluster's pool**, if one exists for the same crop/week/service type and is logistically close enough (same general route or facility).
- **Cancel and go it alone** — the farmer keeps her option to arrange her own transport/storage; HarvestRelay does not block or penalize this.

The pool is then marked `expired` if none of these options are taken up, and any requests still attached to it are released so the farmer can try again for a future week.

## 5. Fairness principle

No single farmer is ever charged for more than her own share of crates. The whole point of pooling is that the **cost of one truck trip or one cold-room booking is split proportionally by crate count** across everyone in the filled pool — nobody subsidizes anybody else, and nobody pays for capacity she didn't use.
