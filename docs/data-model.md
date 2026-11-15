# HarvestRelay — Data Model

> **Status: idea-stage concept.** This is a proposed data structure for the hackathon design, not a schema that has been implemented or deployed. Field names and types are illustrative and would be refined during actual build.

See the diagram: [`data-model.svg`](./data-model.svg).

## Entities at a glance

| Entity | What it represents |
|---|---|
| **Farmer** | A smallholder farmer using a basic phone. |
| **Agent** | A village/co-op coordinator who can manage a pool and accept a quote on the group's behalf. |
| **Provider** | A truck owner or cold-room operator offering pickup/storage capacity. |
| **Request** | One farmer's ask: "I have X crates of crop Y to move/store in week Z." |
| **Pool** | A group of Requests sharing the same village cluster, crop, harvest week, and service type. |
| **Quote** | A Provider's offer (price + pickup day) against a specific Pool. |
| **Booking** | The accepted Quote for a Pool — the point at which a pool "locks in" its pickup. |
| **Receipt** | Per-farmer confirmation of what was actually collected and what she owes, issued after pickup. |

## Key fields per entity

**Farmer**
- `farmer_id` (primary key)
- `name`
- `phone_number`
- `village_cluster`
- `preferred_language`
- `consent_given_at` (when she agreed to data use — see `privacy-by-design.md`)

**Agent**
- `agent_id` (primary key)
- `name`
- `phone_number`
- `village_clusters_managed`
- `role` = `"agent"`

**Provider**
- `provider_id` (primary key)
- `name`
- `phone_number`
- `service_type` (truck or cold room)
- `capacity` (crates per truckload, or cold-room slots)
- `service_area`

**Request**
- `request_id` (primary key)
- `farmer_id` (foreign key → Farmer)
- `crop`
- `crate_count`
- `harvest_week`
- `service_type` (truck or cold room)
- `status` (pending / pooled / booked)
- `pool_id` (foreign key → Pool)

**Pool**
- `pool_id` (primary key)
- `village_cluster`
- `crop`
- `harvest_week`
- `service_type`
- `total_crates_so_far`
- `fill_threshold` (illustrative sample value — see `pooling-rules.md`)
- `status` (open / filled / expired)

**Quote**
- `quote_id` (primary key)
- `pool_id` (foreign key → Pool)
- `provider_id` (foreign key → Provider)
- `price_quoted`
- `pickup_day`
- `status` (submitted / accepted / declined)

**Booking**
- `booking_id` (primary key)
- `pool_id` (foreign key → Pool)
- `quote_id` (foreign key → Quote, the one accepted)
- `accepted_by_agent_id` (foreign key → Agent)
- `status`
- `confirmed_at`

**Receipt**
- `receipt_id` (primary key)
- `booking_id` (foreign key → Booking)
- `farmer_id` (foreign key → Farmer)
- `crates_collected`
- `cost_share` (this farmer's portion of the quoted price, split by crate count)
- `issued_at`

## Relationships

- **Farmer → Request**: one-to-many. A farmer can submit more than one request over time (different weeks or crops).
- **Request → Pool**: many-to-one. Many requests from different farmers group into a single pool once they match on village cluster + crop + harvest week + service type.
- **Provider → Quote**: one-to-many. A provider can quote on multiple pools.
- **Pool → Quote**: one-to-many. A pool can receive several competing quotes before one is accepted.
- **Quote → Booking**: one-to-one. Exactly one quote per pool becomes the accepted booking.
- **Pool → Booking**: one-to-one. A pool becomes a booking once a quote is accepted for it.
- **Agent → Booking**: one-to-many. An agent can accept bookings for multiple pools they manage, acting on the group's behalf.
- **Booking → Receipt**: one-to-many. One receipt is generated per farmer in the pool once pickup happens.
- **Farmer → Receipt**: one-to-many. A farmer accumulates a receipt each time one of her requests is picked up.

## Notes

- A farmer's **cost share** on her Receipt is calculated as her `crate_count` ÷ the pool's `total_crates_so_far`, multiplied by the Quote's `price_quoted` — i.e., she only pays for her share of the truck or cold room, never the whole cost.
- `fill_threshold` values shown in diagrams and docs (e.g. "200 crates for a full truckload," "80 crates for a cold-room minimum") are **sample, illustrative numbers** for the concept — not measured capacity figures from any real truck, cold room, or pilot.
