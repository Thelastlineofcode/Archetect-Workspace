# Archetect Profiling System – v0.1

## Purpose
- Create a non‑proprietary human profiling framework for Archetect that combines:
  - A rigorous Big Five (OCEAN) psychological core.
  - A symbolic “energy” layer inspired by astrology’s elements and modalities.
  - A numerology‑style cycle layer ("Seasons") for time‑based reflection.
- Ensure the system is fully original and does **not** depend on Predictive Index or other proprietary assessments.

---

## Layer 1 – Big Five Core

**Traits (OCEAN)**
- Openness – curiosity, imagination, comfort with novelty.
- Conscientiousness – organization, discipline, follow‑through.
- Extraversion – energy, sociability, assertiveness.
- Agreeableness – cooperation, empathy, warmth.
- Neuroticism – emotional volatility, sensitivity to stress.

**Questionnaire**
- Format: 1–5 (or 1–7) Likert scale items (Strongly disagree → Strongly agree).
- Item count target: 40–60 items total (8–12 per trait), v0.1 can start leaner (e.g., 6–8 items per trait).
- Scoring: each trait score is a weighted sum of its items.
  - Example: score_trait = Σ (w_i * response_i), with some items reverse‑keyed.
- Normalize each trait to a 0–100 scale for simplicity in the product.

**Profile object fields (core)**
- `traits`: { `openness`, `conscientiousness`, `extraversion`, `agreeableness`, `neuroticism` } – numeric, 0–100.
- `raw_responses`: optional, raw item answers for future re‑scoring.

---

## Layer 2 – Archetect Types (Archetypes)

These are narrative types derived from Big Five patterns. They are NOT zodiac signs or PI types.

**Concept**
- Each user gets:
  - One **Primary Archetect Type**.
  - One **Secondary Influence** (optional).
- Types are defined based on characteristic combinations of OCEAN traits.

**Early example type directions (placeholders)**
- "Trailblazer" – high Openness, high Extraversion.
- "Anchor" – high Conscientiousness, low Neuroticism.
- "Bridge" – mid Extraversion, high Agreeableness, mid–high Openness.
- "Seer" – high Openness, introverted (low Extraversion), moderate Neuroticism.

**Profile object fields (types)**
- `primary_type`: string (e.g., "Trailblazer").
- `secondary_type`: string | null.
- `type_scores`: optional map of { type_name: match_score }.

> TODO: Define a full set of ~10–16 Archetect Types, with exact OCEAN ranges/conditions for each.

---

## Layer 3 – Renamed Elements (Energy Styles)

We borrow the *structure* of the four astrological elements but rename and repurpose them as Archetect "Energy Styles". The mapping from traits → energy style is computed; we do **not** use birth data.

**Original astrology concept (for reference only)**
- Fire – action, drive, passion.
- Earth – stability, practicality.
- Air – ideas, communication.
- Water – emotion, intuition.

**Archetect names (Option A)**
- **Spark** – Fire‑like energy.
  - High initiative, expressive, risk‑tolerant.
- **Stone** – Earth‑like energy.
  - Grounded, structured, dependable.
- **Signal** – Air‑like energy.
  - Idea‑driven, analytical, communicative.
- **Current** – Water‑like energy.
  - Emotion‑attuned, relational, intuitive.

**Archetect names (Option B, more abstract)**
- **Ignite** (Fire), **Root** (Earth), **Circuit** (Air), **Tide** (Water).

**Trait → Energy Style (draft logic)**
- Spark (Fire‑like)
  - High Extraversion, high Openness.
- Stone (Earth‑like)
  - High Conscientiousness, low–moderate Neuroticism.
- Signal (Air‑like)
  - High Openness, mid Extraversion, mid Neuroticism.
- Current (Water‑like)
  - High Agreeableness, higher Neuroticism OR introversion (low Extraversion).

**Profile object fields (energy)**
- `energy_style`: enum("Spark", "Stone", "Signal", "Current") or chosen naming set.
- `energy_rationale`: short text string explaining why this style was chosen from traits.

---

## Layer 4 – Renamed Modalities (Flow Modes)

We borrow the *structure* of the three astrological modalities (Cardinal, Fixed, Mutable) and reinterpret them as Archetect "Flow Modes". Again, driven by traits rather than birth data.

**Original astrology concept (for reference only)**
- Cardinal – initiating, starting cycles.
- Fixed – stabilizing, persisting.
- Mutable – adapting, changing.

**Archetect names (Option A – role‑like)**
- **Initiator** (Cardinal) – starts things.
- **Keeper** (Fixed) – sustains and maintains.
- **Shifter** (Mutable) – adapts and pivots.

**Archetect names (Option B – noun modes)**
- **Launch** (Cardinal) – energy of beginning.
- **Anchor** (Fixed) – energy of stability.
- **Flow** (Mutable) – energy of transition.

**Trait → Flow Mode (draft logic)**
- Initiator / Launch (Cardinal‑like)
  - High Extraversion, high Conscientiousness.
- Keeper / Anchor (Fixed‑like)
  - High Conscientiousness, mid–low Openness, low–mid Neuroticism.
- Shifter / Flow (Mutable‑like)
  - High Openness, mid Conscientiousness, mid Extraversion.

**Profile object fields (flow)**
- `flow_mode`: enum (e.g., "Initiator", "Keeper", "Shifter").
- `flow_rationale`: short text string tied to trait pattern.

---

## Layer 5 – Numerology‑Style Seasons (Cycles)

Instead of copying numerology directly, Archetect introduces **Seasons** – time‑bound phases mapped to focus and risk appetite.

**Concept**
- Seasons describe the "chapter" a person is in relative to their goals and current context.
- Could be optionally driven by:
  - Self‑reported current priorities (career, relationships, growth, etc.).
  - Time window (month/quarter/year).
  - Recent changes (job change, move, new project).

**Example Seasons (draft)**
- **Build Season** – focus on structure, execution, career.
- **Explore Season** – focus on ideas, learning, experimentation.
- **Connect Season** – focus on relationships and community.
- **Reset Season** – focus on rest, recovery, reorientation.

**Numeric layer**
- Optionally attach a simple 1–9 "Cycle Number" representing intensity or focus level (our own mapping, not Pythagorean numerology).

**Profile object fields (season)**
- `season_name`: string (e.g., "Explore").
- `season_number`: integer 1–9.
- `season_horizon`: string (e.g., "Q1 2026").

---

## Combined Profile Object (v0.1 sketch)

```json
{
  "traits": {
    "openness": 78,
    "conscientiousness": 62,
    "extraversion": 71,
    "agreeableness": 55,
    "neuroticism": 34
  },
  "primary_type": "Trailblazer",
  "secondary_type": "Bridge",
  "energy_style": "Spark",
  "flow_mode": "Initiator",
  "season_name": "Explore",
  "season_number": 3,
  "season_horizon": "Q2 2026"
}
```

---

## Narrative Generation

For the user, Archetect should output:
- A visual (radar chart or bar chart) of Big Five traits.
- A short paragraph for each layer:
  - Traits (what you tend to do).
  - Type (who you feel like in the story).
  - Energy Style (how your energy shows up).
  - Flow Mode (how you move through change).
  - Season (what chapter you are in right now).

**Example narrative framing (Spark + Initiator)**
- "Your energy runs hot and fast, with a bias toward starting bold moves before others are ready. You thrive when you can light the first spark and get momentum going, then hand off the long‑term maintenance." (Copy to be iterated and branded in an Archetect voice.)

---

## Implementation Notes / Next Steps

1. **Lock naming choices**
   - Decide on final names for Energy Styles (Spark/Stone/Signal/Current vs alternatives).
   - Decide on final names for Flow Modes (Initiator/Keeper/Shifter vs Launch/Anchor/Flow).

2. **Define full type system**
   - Draft 10–16 Archetect Types, each with:
     - Name and 2–3 sentence description.
     - OCEAN pattern (ranges, thresholds, or cluster centroids).

3. **Finalize trait → energy/flow mapping**
   - Convert the draft logic above into precise if/else or scoring rules.
   - Consider ties and edge cases (e.g., equally strong Spark and Signal).

4. **Build scoring function**
   - Input: questionnaire responses.
   - Output: profile object as sketched above.
   - Technology: Python / TypeScript service.

5. **Integrate into Archetect UI**
   - Design profile screens using only Archetect names (no astrology, no PI terminology).
   - Emphasize that this is a reflection and coaching tool, not a clinical or hiring test.

This document is the initial spec for the Archetect Profiling System. Future versions can refine naming, mappings, and narrative tone as the product voice evolves.
