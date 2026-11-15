# HarvestRelay — Future Feature: Provider Marketplace (Web, alongside USSD)

> **Status: idea-stage proposal.** This is a described future extension, not something built or demoed. It is additional to the core USSD/SMS pooling design covered in `architecture.md`, `data-model.md`, and `pooling-rules.md` — it does not change or replace any of that.

See the diagram: [`marketplace-extension.svg`](./marketplace-extension.svg).

## Why add this

The core flow (USSD pooling) waits for a pool to reach its fill threshold before inviting providers to quote — that's what keeps cost splitting fair, but it means a farmer has to wait. For farmers, agents, and providers who *do* have smartphone or web access, a marketplace gives a faster, optional second path: browse truck owners and cold-room operators directly, filter by location, and send a hire request immediately, without waiting on a pool.

This is explicitly a second channel, not a replacement — most target farmers are still basic-phone, USSD-first users.

## What it adds

- **Service Listing** — a standing offer a truck owner or cold-room operator creates and manages: service type, the village clusters they serve, an indicative price, and capacity/availability notes.
- **Browse and filter** — a farmer or agent browses open listings and filters by **village cluster** — the same grouping key the core pooling design already uses, so no new location concept (GPS/map radius) is needed for an MVP.
- **Direct hire request** — a farmer or agent sends a hire request straight to a specific provider's listing, instead of waiting for a pool. If accepted, it becomes a **Booking** — and from that point on, pickup and the SMS receipt work exactly as they do for a pooled booking.
- **Login** — a lightweight phone-number + one-time SMS code, for both providers (to manage a listing) and farmers/agents (to send a request). This reuses the existing USSD/SMS Gateway for OTP delivery — no new telecom integration, just a different use of the one already in the architecture.

## Data model changes (additive only)

- New entity **ServiceListing**: `listing_id`, `provider_id` (→ Provider), `service_type`, `village_clusters_served`, `indicative_price`, `capacity_notes`, `active`.
- New entity **HireRequest**: `request_id`, `farmer_id` (or `agent_id`), `listing_id` (→ ServiceListing), `crates`, `proposed_week`, `status` (pending / accepted / declined).
- **Booking** gains an optional `pool_id` — populated when the booking came from a filled Pool (as today), left empty when it came directly from an accepted HireRequest. Nothing else about Booking, pickup, or Receipt changes.

## Where it sits in the architecture

No new backend system. The existing **Web Dashboard** (today serving Agent and Provider pages) gains a third surface — a Marketplace page — that talks to the same **API Layer**, the same **Database**, and a parallel piece of logic alongside the Pooling Service. See the diagram for the full picture: the left-hand column is the unchanged core flow, the right-hand (dashed, amber) column is this proposed addition, and they converge on the same API, database, and Booking → Receipt flow.

## How it relates to the pooling rules

A farmer effectively chooses between two paths for the same need:

| Path | Speed | Cost |
|---|---|---|
| **Pool (USSD, existing)** | Waits for the pool to fill | Lower — cost split across every farmer in the pool |
| **Marketplace (web, proposed)** | Immediate, if a provider accepts | Higher per farmer — no splitting unless she brings her own group |

Both paths end at the same Booking → pickup → SMS Receipt flow described in `sequence-diagram.md`.

## Privacy

Same principles as the rest of the design (see `privacy-by-design.md`): minimal data collected (phone number plus listing or request details only), consent at first login, role-based access (a provider sees only their own listings and incoming requests; a farmer sees only her own requests), encryption in transit and at rest.

## Why this is listed as a future feature, not in the demo

Building this credibly — login, listing management, a location filter, a direct hire flow that still reaches the same receipt — is meaningfully more scope than the core concept this submission demonstrates. It's listed here as a validated next step for the roadmap (see the PDF's Roadmap section) rather than rushed into the clickable demo under deadline, where a half-built login flow would do more to undercut the idea-stage framing than to strengthen it.
