# HarvestRelay — Sequence Diagram (One Booking, End to End)

> **Status: idea-stage concept.** This walks through one illustrative example booking from first request to final receipt, for the hackathon design. All crate counts, prices, and days are sample values — no real transaction has occurred.

See the diagram: [`sequence-diagram.svg`](./sequence-diagram.svg).

## Participants (lifelines)

- **Farmer** — the smallholder using a basic phone.
- **USSD/SMS Gateway** — telecom-facing layer (see `architecture.md`).
- **Provider** — the truck owner or cold-room operator.
- **API Layer** — validates and routes requests.
- **Pooling Service** — the core matching/booking logic.
- **Database** — stores Requests, Pools, Quotes, Bookings, Receipts.
- **Agent** — the village/co-op coordinator who accepts a quote on the group's behalf.

## Phase 1 — Farmer joins a pool

1. Farmer dials the USSD code, selects crop, crate count, harvest week, and service type (truck or cold room).
2. Gateway forwards the session data to the API Layer.
3. API Layer asks the Pooling Service to create a Request.
4. Pooling Service saves the Request to the Database.
5. Database returns the pool's running total — sample: **160 of 200 crates** (see `pooling-rules.md` for sample thresholds).
6. Pooling Service tells the API Layer the pool is still open.
7. API Layer passes the confirmation message back to the Gateway.
8. Gateway sends the Farmer an SMS: *"You've joined the pool."*

*Over the following days, more farmers' requests join the same pool (same village cluster + crop + harvest week + service type) until it reaches the sample threshold.*

## Phase 2 — Provider quotes, Agent accepts

9. Once the pool is filled, the Pooling Service asks the Gateway to notify nearby Providers.
10. Gateway sends an SMS inviting the Provider to quote.
11. Provider submits a quote (price + pickup day), typically via the web dashboard.
12. API Layer passes the quote to the Pooling Service to record.
13. Pooling Service saves the Quote to the Database.
14. Pooling Service flags the quote as ready for the Agent's review.
15. The quote appears on the Agent's dashboard.
16. Agent accepts the quote on behalf of the pool, via the dashboard.
17. API Layer tells the Pooling Service to turn the accepted Quote into a Booking.
18. Pooling Service saves the Booking to the Database.

## Phase 3 — SMS confirmations to every farmer

19. Pooling Service prepares a personalized SMS for each farmer in the pool: her cost share (split by crate count) and the pickup day.
20. Gateway sends it, e.g. sample text: *"Your share = ₦3,200 — pickup Thursday."*
21. Farmer confirms, by SMS reply or a short USSD session.
22. Gateway passes the confirmation back through the API Layer.
23. Pooling Service marks that farmer as confirmed.

*Pickup day arrives. The Provider collects crates from each farmer in the pool along the agreed route, per the accepted Booking.*

## Phase 4 — Pickup and receipt

24. Provider logs the crates actually collected from each farmer, via the dashboard.
25. API Layer passes this to the Pooling Service.
26. Pooling Service creates a Receipt for each farmer in the Database.
27. Pooling Service asks the Gateway to send the receipt SMS.
28. Gateway sends it, e.g. sample text: *"32 crates collected — ₦3,200 charged."*

## Notes

- This is **one illustrative example pool**. Real crate counts, prices (₦ is used only as a sample currency symbol), and days are placeholders chosen to make the flow concrete, not measured data.
- Steps 9, 19, and 27 are drawn as a single hop from Pooling Service to Gateway for readability — in practice they pass through the API Layer as well, the same way every other Gateway↔Pooling exchange does.
- If the pool never reaches its threshold, the flow instead follows the "pool does not fill in time" path described in `pooling-rules.md`, and Phases 2–4 above never happen for that pool.
