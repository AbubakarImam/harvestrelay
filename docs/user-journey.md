# HarvestRelay — A Farmer's Journey (Illustrative Scenario)

> **This is a fictional, illustrative walkthrough using sample data from the HarvestRelay demo.** No real farmers, villages, pilots, or partners are involved — the names below ("Amina Tanko," "Dagiri Cluster") are invented for storytelling purposes only, and the numbers come straight from the demo's sample dataset.

## The story

Amina Tanko grows tomatoes on a small plot near Dagiri, in a cluster of villages too far from the market for any single farmer to justify hiring a truck. This week she has harvested **15 crates** — not enough on her own to fill a lorry, but enough to be worth pooling with her neighbors. She doesn't have a smartphone, just a basic handset. Here is how HarvestRelay gets her tomatoes to market.

### 1. Dialing in

Amina dials the USSD short code her village agent gave her. The menu greets her and asks her to confirm the call.

Screenshot: 01-ussd-dial.png — The USSD welcome screen a farmer sees after dialing *384*77# on a basic phone.

She selects her village cluster (Dagiri Cluster), then picks her crop.

Screenshot: 02-ussd-crop-select.png — Choosing a crop from the USSD menu — Amina selects Tomatoes.

### 2. Telling the system how much she has

Next, the menu asks how many crates she's bringing, and which week she expects to harvest.

Screenshot: 03-ussd-crates-entry.png — Amina enters 15 crates into the USSD form.

Screenshot: 04-ussd-week-select.png — She selects her harvest week so the system knows when to start pooling.

She's then asked whether she wants to share a truck or a cold room — tomatoes move fast, so she picks the truck pool.

Screenshot: 05-ussd-service-choice.png — Choosing between a shared truck pool and a shared cold-room pool.

### 3. Joining the pool

After confirming her details, Amina joins the pool. The screen shows her this isn't a solo booking — she's now one of several farmers in the Dagiri Cluster truck pool, which already has 165 of the 200 crates it needs.

Screenshot: 06-ussd-pool-joined.png — Confirmation that Amina's request joined the pool, with a live progress bar showing 165/200 crates.

### 4. The pool fills up

Over the next day, more farmers in the cluster join in with their own crates until the pool reaches its 200-crate threshold. On the Agent dashboard, the village agent watches this happen in real time — the same pool Amina joined now shows as full and ready for a provider quote.

Screenshot: 07-agent-dashboard-pools.png — The agent dashboard showing the Dagiri Cluster pool at 200/200 crates (100%), alongside other pools at various stages.

### 5. A truck owner sends a price

Danjuma Haulage, a local truck operator, checks the provider page and sees the now-full Dagiri Cluster pool is ready for a quote. He submits his price per crate and proposes a pickup day.

Screenshot: 08-provider-quote.png — A truck operator filling in a price-per-crate and pickup day to submit a quote for the full pool.

### 6. The agent accepts the best offer

Back on the agent dashboard, the village agent sees Danjuma Haulage's quote come in and accepts it with one tap.

Screenshot: 09-agent-accept-quote.png — The agent dashboard showing the incoming quote (₦300/crate, pickup Mon 17 Nov) with the Accept button.

### 7. Amina gets her SMS

Within moments, Amina's phone buzzes with a text message. It tells her who's collecting, when, and exactly what her share of the trip will cost.

Screenshot: 10-sms-cost-share.png — The SMS confirming the pool is ready: Danjuma Haulage will collect on Mon 17 Nov, and Amina's share for her 15 crates is ₦4,500.

She replies "1" to confirm she'll be ready with her crates that morning.

### 8. Pickup day and the receipt

On the pickup day, Danjuma Haulage's truck arrives, collects the crates from everyone in the pool, and marks the job done from the provider page. Amina's phone receives one last SMS — her receipt.

Screenshot: 11-sms-receipt.png — The final SMS receipt confirming 15 crates of tomatoes collected, with a receipt number for Amina's records.

### Bonus: built for the phones people actually have

Because many farmers in these clusters are more comfortable in Hausa, every USSD screen can toggle language with one tap.

Screenshot: 12-ussd-hausa-toggle.png — The same USSD welcome screen shown in Hausa ("Bugi *384*77#" / "Barka da zuwa HarvestRelay"), demonstrating the built-in EN/HA toggle.

---

## Screenshot index

| # | Filename | Caption |
|---|----------|---------|
| 1 | 01-ussd-dial.png | The USSD welcome screen a farmer sees after dialing *384*77# on a basic phone. |
| 2 | 02-ussd-crop-select.png | Choosing a crop from the USSD menu — Amina selects Tomatoes. |
| 3 | 03-ussd-crates-entry.png | Amina enters 15 crates into the USSD form. |
| 4 | 04-ussd-week-select.png | She selects her harvest week so the system knows when to start pooling. |
| 5 | 05-ussd-service-choice.png | Choosing between a shared truck pool and a shared cold-room pool. |
| 6 | 06-ussd-pool-joined.png | Confirmation that Amina's request joined the pool, with a live progress bar showing 165/200 crates. |
| 7 | 07-agent-dashboard-pools.png | The agent dashboard showing the Dagiri Cluster pool at 200/200 crates (100%), alongside other pools at various stages. |
| 8 | 08-provider-quote.png | A truck operator filling in a price-per-crate and pickup day to submit a quote for the full pool. |
| 9 | 09-agent-accept-quote.png | The agent dashboard showing the incoming quote (₦300/crate, pickup Mon 17 Nov) with the Accept button. |
| 10 | 10-sms-cost-share.png | The SMS confirming the pool is ready: Danjuma Haulage will collect on Mon 17 Nov, and Amina's share for her 15 crates is ₦4,500. |
| 11 | 11-sms-receipt.png | The final SMS receipt confirming 15 crates of tomatoes collected, with a receipt number for Amina's records. |
| 12 | 12-ussd-hausa-toggle.png | The same USSD welcome screen shown in Hausa, demonstrating the built-in EN/HA toggle. |
