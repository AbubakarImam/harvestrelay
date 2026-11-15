# HarvestRelay — System Architecture

> **Status: idea-stage concept.** Nothing described here has been built, deployed, piloted, or agreed with any partner. This document is a proposed design for a hackathon submission. Component names, vendor examples, and numbers are illustrative only.

See the diagram: [`architecture.svg`](./architecture.svg).

## Why a basic-phone architecture

HarvestRelay is designed for smallholder farmers who mostly carry basic ("feature") phones, not smartphones, and who may have patchy or no mobile data. So the primary interface is **USSD** (the menu system you reach by dialing a short code like `*123#`) for live interaction, backed by **SMS** for anything that needs to reach the farmer later (confirmations, receipts, reminders) or outside of a live session.

A browser-based **web dashboard** exists alongside this for the people who need a fuller view of a village cluster's activity and who are more likely to have smartphone or desktop access: village agents (co-op leaders) and providers (truck owners, cold-room operators).

## The pieces

| Component | Role |
|---|---|
| **Farmer (basic phone)** | Dials the USSD code, navigates the menu, confirms by SMS reply. Never needs an app or data plan. |
| **Village Agent** | A trusted local coordinator (e.g. a co-op leader). Can use USSD/SMS like a farmer, or the web dashboard to see the whole pool and accept a provider's quote on the group's behalf. |
| **Provider** | A truck owner or cold-room operator. Receives quote invitations by SMS and/or dashboard, submits a price and pickup day, and later logs crates actually collected. |
| **USSD/SMS Gateway** | The telecom-facing layer that turns a USSD session or an SMS into an API call, and turns an API response back into USSD screens or outbound SMS. **Example only:** a service like *Africa's Talking* is the kind of aggregator this role could use — this is an illustrative choice for the concept, **not** a confirmed technology partner or signed agreement. |
| **API Layer** | Validates incoming requests, checks who is allowed to do what (role-based access — see `privacy-by-design.md`), and routes work to the Pooling Service. |
| **Pooling Service** | The core logic: groups incoming farmer requests into pools by village cluster + crop + harvest week + service type, watches whether a pool has reached its fill threshold, manages the provider-quote step, and manages booking + receipt creation. See `pooling-rules.md` for the rules themselves. |
| **Database** | Stores all records: Farmers, Agents, Providers, Requests, Pools, Quotes, Bookings, Receipts. See `data-model.md` for the detailed structure. |
| **Web Dashboard** | Browser pages for Agents (watch pool fill, review and accept quotes) and Providers (submit quotes, record pickups), plus a simple admin view. |

## How data flows

1. A **Farmer** or **Agent** dials the USSD code. The **Gateway** turns each menu step into an API call.
2. The **API Layer** validates the session and passes the request to the **Pooling Service**.
3. The **Pooling Service** reads/writes the **Database** to create or update a Request, and to check whether the matching Pool has reached its threshold.
4. Once a Pool is full (or reaches a cold-room minimum), the Pooling Service invites nearby **Providers** to quote — via SMS (through the Gateway) and/or the **Web Dashboard**.
5. A Provider submits a quote through the dashboard; the Agent reviews and accepts one quote, again through the dashboard or a USSD/SMS flow.
6. Confirmations flow back out to every Farmer in the pool as **SMS** (cost share + pickup day), via the Gateway.
7. On pickup day, the Provider logs crates collected through the dashboard; each Farmer receives an SMS receipt.

This mirrors the end-to-end example walked through in [`sequence-diagram.md`](./sequence-diagram.md).

## Design notes

- **HarvestRelay owns no trucks and no cold rooms.** It is a coordination layer only — matching existing local capacity (one truck, one cold room) to pooled demand, the way a ride-pooling or short-stay marketplace matches supply to demand without owning the vehicles or the rooms.
- **Everything works over USSD/SMS first.** The web dashboard is a convenience layer for agents and providers, not a requirement for farmers.
- **One Gateway, one API Layer.** Both farmer-facing USSD/SMS traffic and agent/provider dashboard traffic pass through the same API Layer, so role-based rules and data handling stay consistent regardless of channel.
