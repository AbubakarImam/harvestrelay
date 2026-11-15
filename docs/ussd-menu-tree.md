# HarvestRelay — USSD Menu Tree

> **Status: idea-stage concept.** The dial code, menu wording, and sample values below are illustrative placeholders for this hackathon design — not final copy, not a built system, and not real data.

See the diagram: [`ussd-menu-tree.svg`](./ussd-menu-tree.svg).

## Text version (backup / screen-reader friendly)

```
Dial *384*1#   (sample USSD code — illustrative only)
│
└── Choose Language
    1. English   2. Hausa   3. Yoruba   4. Igbo   (sample list)
    (First-time users also see a short consent message here — see privacy-by-design.md)
    │
    └── MAIN MENU
        1. Join a Pool (truck or cold room)
        2. Check My Pool Status
        3. Confirm Pickup / View Last Receipt
        4. Help
        0. Exit

        ── If "1. Join a Pool" ──────────────────────────────────────
        │
        └── Choose Crop
            1. Tomatoes   2. Peppers   3. Other (type name)
            9. Back
            │
            └── Enter Number of Crates
                Free-text entry, e.g. "45"
                9. Back
                │
                └── Choose Harvest Week
                    1. This week   2. Next week
                    9. Back
                    │
                    └── Choose Service
                        1. Truck pooling (share a truck)
                        2. Cold room (share cold storage)
                        9. Back
                        │
                        └── Review & Confirm
                            "Tomatoes, 45 crates, this week, truck pooling.
                             Join this pool?"
                            1. Confirm   2. Cancel
                            9. Back
                            │
                            ├── 1. Confirm → session ends.
                            │      SMS sent: "You've joined the tomato pool
                            │      for this week. We'll text you when it's
                            │      ready." (sample text)
                            │
                            └── 2. Cancel → back to MAIN MENU

        ── If "2. Check My Pool Status" ─────────────────────────────
        └── Shows: "Your pool: 140/200 crates. Still open." (sample)

        ── If "3. Confirm Pickup / View Last Receipt" ───────────────
        └── Shows: crates collected, amount owed/paid (sample)

        ── If "4. Help" ──────────────────────────────────────────────
        └── Shows: short explanation of how pooling works + local
            agent's contact number
```

## Notes

- **"9. Back"** returns to the previous screen at every step; **"0. Exit"** ends the session from the main menu. These are common USSD conventions assumed for this concept.
- The menu is deliberately shallow (at most 5 steps from dial to confirmation) because USSD sessions can time out and basic-phone users may be navigating by feel — every screen matters.
- After confirming a pool join, the farmer is not left guessing: she gets an SMS immediately, and further SMS messages follow automatically at each later stage (quote accepted, pickup day, receipt) — see [`sequence-diagram.md`](./sequence-diagram.md).
- Language, crop list, dial code, and all sample numbers shown are **placeholders** for the idea-stage concept and would be adapted to the real deployment area and confirmed with local users before any build.
