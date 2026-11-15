# HarvestRelay — Privacy by Design

> **Status: idea-stage concept.** These are proposed privacy principles for the hackathon design — no system has been built, no data has been collected, and there are no real users yet. They describe how the system *should* be built, as a commitment, not a report on what has been implemented.

## Why this matters here specifically

HarvestRelay's users are mostly reached over **basic phones, USSD and SMS**, often in areas with low digital literacy and little exposure to formal data-protection concepts. That makes two things especially important: collecting as little as possible, and explaining things in plain language a farmer can actually understand over a phone menu — not a legal document she'll never read.

## 1. Minimal data collection

HarvestRelay only collects what it needs to run a pool and get a farmer paid and picked up fairly:

- **Farmer:** name, phone number, village cluster, crop, crate count, harvest week, service type, preferred language.
- **Agent:** name, phone number, the village cluster(s) they coordinate.
- **Provider:** name, phone number, vehicle/cold-room capacity, service area.

What it deliberately does **not** collect: national ID numbers, bank account or mobile-money credentials (payment, if added later, would be handled through an existing mobile-money or cash-on-pickup flow rather than HarvestRelay holding financial credentials itself), farm size/land records, or any data unrelated to running a pool. If a future feature needs more data, the bar is: *would a farmer immediately understand why we're asking for this?*

## 2. Consent on first use

The **first time** anyone dials in — farmer, agent, or provider — the USSD flow shows a short, plain-language consent message before anything else, for example:

> *"HarvestRelay uses your phone number, village, and crop details to group your harvest with others nearby so you can share a truck or cold room. We will text you about your pool and never share your number outside HarvestRelay. Continue? 1. Yes 2. No"*

- Declining ("No") exits the session without saving any data beyond the phone number needed to recognize a repeat "No" (so she isn't asked again every single call in a way that feels like harassment — though re-asking occasionally, e.g. if terms change, is reasonable).
- Consent is recorded with a timestamp (`consent_given_at` — see `data-model.md`) so there's a record that it was asked and answered, not assumed.
- No crop/crate/pooling data is created for a farmer until consent is given.

## 3. Role-based access

Everyone who touches the system only sees what their role needs — nothing more:

| Role | Can see | Cannot see |
|---|---|---|
| **Farmer** | Her own requests, her own pool's status, her own cost share, her own receipts. | Other farmers' individual data, provider pricing details for other pools. |
| **Agent** | Pool-level data for the village cluster(s) she coordinates: who's in the pool and their crate counts (needed to split cost fairly), quotes received, booking status. | Farmers' data outside her cluster, provider's internal business data beyond the quote itself. |
| **Provider** | The pools she's invited to quote on (crate totals, pickup location, pickup week) and bookings she's accepted. | Individual farmers' phone numbers unless needed for pickup coordination; other providers' quotes. |
| **Admin** (HarvestRelay operations) | Aggregated/operational view for support and monitoring. | Access to full farmer records should still be logged and limited to what's needed for support — admin access is a responsibility, not a default. |

This is enforced at the **API Layer** (see `architecture.md`), so the same rule applies whether someone reaches the system over USSD/SMS or the web dashboard.

## 4. Encryption in transit and at rest

- **In transit:** all traffic between the Gateway, API Layer, Pooling Service, Database, and Web Dashboard would run over encrypted connections (e.g. TLS). USSD/SMS traffic between a farmer's phone and the telecom network follows standard telecom-level protections, which is a known limitation of the channel (USSD/SMS are not end-to-end encrypted at the handset) — this is why no sensitive financial credentials are ever requested over USSD/SMS.
- **At rest:** the Database would store farmer, agent, and provider records encrypted at rest, with phone numbers treated as sensitive personal data even though they're also the primary way the system reaches someone.

## 5. Data retention stance

- Keep **active pooling data** (requests, pools, quotes, bookings, receipts) only as long as needed to run the current and recently-completed harvest cycles plus a reasonable window for dispute resolution (e.g. a season).
- Keep **historical receipts** longer if a farmer or agent might reasonably need proof of a past transaction, but in a reduced/archived form rather than fully "live" in the operational database.
- **Delete or anonymize** data for a farmer who asks to stop using the service, beyond what must be kept for legal/dispute reasons.
- Never sell or share farmer/provider contact data to third parties; data stays within what's needed to run the pool it was collected for.

## Plain-language summary (what we'd actually tell a farmer)

> *"We only ask for what we need to group your harvest with your neighbors' and get you paid fairly. We ask your permission the first time. Only the right people see your information — not every farmer, not every provider. We keep your data safe and don't keep it longer than we need to."*
