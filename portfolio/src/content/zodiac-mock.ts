import type { ZodiacSlug } from "./site";

/**
 * Mock horoscope row — shape matches the admin-dashboard2 `Horoscope` table
 * (see `admin-dashboard2/lib/types.ts`) so wiring this to the real backend later
 * is a single-file swap of `getMockHoroscope` -> `fetchHoroscope`.
 */
export type MockHoroscope = {
  zodiacSign: ZodiacSlug;
  date: string;
  title: string;
  summary: string;
  loveText: string;
  wealthText: string;
  healthText: string;
  loveConfidence: number;
  wealthConfidence: number;
  healthConfidence: number;
};

export type DayMode = "yesterday" | "today" | "tomorrow";

const MOCK: Record<ZodiacSlug, Record<DayMode, Omit<MockHoroscope, "zodiacSign" | "date">>> = {
  aries: {
    yesterday: {
      title: "Quiet courage",
      summary:
        "Yesterday rewarded the small brave choice over the loud one. The energy you spent on a careful conversation will compound today.",
      loveText: "A measured exchange cleared the air with someone close — note what worked.",
      wealthText: "A small follow-up email opened a door. Your discipline is paying its quiet interest.",
      healthText: "Rest sat on top of your priority list, and your body said thank you. Keep that streak going.",
      loveConfidence: 62,
      wealthConfidence: 58,
      healthConfidence: 71,
    },
    today: {
      title: "Aim and act",
      summary:
        "Energy is high — channel it into one meaningful move today, not ten half-finished ones. Pick the goal that scares you a little, then start.",
      loveText: "A direct, kind message lands better than a perfect one. Send it.",
      wealthText: "A leadership moment is yours if you claim it early in the day.",
      healthText: "Cardio — even a brisk walk — turns nervous energy into focus.",
      loveConfidence: 74,
      wealthConfidence: 81,
      healthConfidence: 68,
    },
    tomorrow: {
      title: "Steady the flame",
      summary:
        "Tomorrow asks you to keep the fire without burning the kitchen. Pace the work, protect the late afternoon for thinking.",
      loveText: "Listen twice as long as you talk and watch how quickly trust builds.",
      wealthText: "A plan you sketched today gets a green light tomorrow — be ready to ship.",
      healthText: "Hydrate early and often; your body is doing more than your calendar shows.",
      loveConfidence: 70,
      wealthConfidence: 76,
      healthConfidence: 73,
    },
  },
  taurus: {
    yesterday: {
      title: "Slow wins",
      summary: "A patient choice yesterday set up an easier today. Trust the pacing.",
      loveText: "A small kindness was noticed — even if no one mentioned it.",
      wealthText: "A long-running task crossed a quiet milestone. Document the progress.",
      healthText: "You honored your sleep. Stay with the rhythm tonight too.",
      loveConfidence: 66,
      wealthConfidence: 70,
      healthConfidence: 78,
    },
    today: {
      title: "Stand your ground",
      summary:
        "Your sense of value is sharp today — defend it without apology. Money decisions made in the morning will hold up later.",
      loveText: "Comfort is a love language; offer it generously to those you trust.",
      wealthText: "A negotiation tilts toward you — name the number you want.",
      healthText: "Stretch first, scroll second. Your back will thank you.",
      loveConfidence: 78,
      wealthConfidence: 84,
      healthConfidence: 65,
    },
    tomorrow: {
      title: "Plant something",
      summary: "Tomorrow rewards a small investment in a future you barely see yet.",
      loveText: "Plan a low-key date — connection beats spectacle this week.",
      wealthText: "Open the spreadsheet you've been avoiding. The picture isn't as scary as it looks.",
      healthText: "A new healthy habit only needs five minutes to start counting.",
      loveConfidence: 72,
      wealthConfidence: 69,
      healthConfidence: 74,
    },
  },
  gemini: {
    yesterday: {
      title: "Bright signal",
      summary: "An idea from yesterday is more useful than it first looked. Write it down before it drifts.",
      loveText: "A short, witty message was the right amount of brave.",
      wealthText: "Networking that felt casual will pay back in introductions.",
      healthText: "Caffeine was loud — try gentler fuel today.",
      loveConfidence: 64,
      wealthConfidence: 67,
      healthConfidence: 55,
    },
    today: {
      title: "Two threads",
      summary:
        "Today wants you to pick the two most interesting threads and drop the rest. Curiosity is the engine — focus is the steering wheel.",
      loveText: "Ask one good question and let silence do the heavy lifting.",
      wealthText: "A conversation today turns into a contract within the week.",
      healthText: "A short, tech-free walk resets your nervous system in 12 minutes.",
      loveConfidence: 71,
      wealthConfidence: 79,
      healthConfidence: 62,
    },
    tomorrow: {
      title: "Clarify and ship",
      summary: "Tomorrow's gift is clarity — write the email you've been rewriting.",
      loveText: "Plain words land better than clever ones. Keep it simple.",
      wealthText: "A decision you've been postponing closes itself once stated out loud.",
      healthText: "Sleep is the upgrade you keep skipping. Try eight, not six.",
      loveConfidence: 69,
      wealthConfidence: 73,
      healthConfidence: 70,
    },
  },
  cancer: {
    yesterday: {
      title: "Tender attention",
      summary: "You held space for someone yesterday and it mattered more than they could say.",
      loveText: "Care landed exactly where it needed to. Note the moment.",
      wealthText: "A gentle pace meant fewer mistakes — quietly impressive.",
      healthText: "An early night did the repair work nothing else could.",
      loveConfidence: 80,
      wealthConfidence: 60,
      healthConfidence: 76,
    },
    today: {
      title: "Home base",
      summary:
        "Today rewards turning toward home, family, and the people who already know you. Decisions made at the kitchen table will be the right ones.",
      loveText: "An honest, soft check-in deepens an old bond.",
      wealthText: "Tidy the workspace; clarity follows the clean desk.",
      healthText: "A warm meal at a real table beats anything eaten standing up.",
      loveConfidence: 83,
      wealthConfidence: 64,
      healthConfidence: 72,
    },
    tomorrow: {
      title: "Quiet expansion",
      summary: "Tomorrow you'll feel a little braver than usual — say the thing.",
      loveText: "Express what you've been protecting. The right person was waiting.",
      wealthText: "A cautious yes opens an unexpected revenue line.",
      healthText: "Try water and a stretch before coffee — small change, real result.",
      loveConfidence: 77,
      wealthConfidence: 69,
      healthConfidence: 74,
    },
  },
  leo: {
    yesterday: {
      title: "Warm room",
      summary: "Your presence lifted a room yesterday. That energy is a renewable resource — use it wisely today.",
      loveText: "A compliment you gave is still echoing somewhere. Generosity scales.",
      wealthText: "A creative pitch sounded better out loud than on paper.",
      healthText: "Sun on skin counts as nutrition. Don't skip it.",
      loveConfidence: 76,
      wealthConfidence: 73,
      healthConfidence: 67,
    },
    today: {
      title: "Center stage",
      summary:
        "You're wildly popular these days, and you should take advantage of this opportunity for advancement. Try to take pride in your wins and you'll see who your friends and foes are.",
      loveText: "Confidence is magnetic today. Wear the thing you usually save.",
      wealthText: "An ask you've been rehearsing finally lands the right answer.",
      healthText: "Heart-rate up early; the day cooperates after.",
      loveConfidence: 81,
      wealthConfidence: 88,
      healthConfidence: 70,
    },
    tomorrow: {
      title: "Sustain the glow",
      summary: "Tomorrow you trade volume for depth. Quieter rooms, deeper conversations.",
      loveText: "An old friend wants to reconnect. Pick up the call.",
      wealthText: "Pricing yourself low is no longer cute. Update the rate.",
      healthText: "Rest is part of the routine, not a reward for finishing it.",
      loveConfidence: 73,
      wealthConfidence: 75,
      healthConfidence: 72,
    },
  },
  virgo: {
    yesterday: {
      title: "Useful detail",
      summary: "A small fix yesterday saved someone three hours today. You'll never hear about it. That's fine.",
      loveText: "Service is your love language and it's working.",
      wealthText: "A clean checklist pulled a stuck project out of the mud.",
      healthText: "Skipped a meal — body noticed. Don't repeat it.",
      loveConfidence: 65,
      wealthConfidence: 78,
      healthConfidence: 60,
    },
    today: {
      title: "Tidy the system",
      summary:
        "Today rewards process, not heroics. Build the small system that lets you stop solving the same problem twice.",
      loveText: "Dependability is the most underrated romance there is.",
      wealthText: "An audit you've been avoiding turns up real money.",
      healthText: "A 20-minute walk after lunch is medicine.",
      loveConfidence: 69,
      wealthConfidence: 82,
      healthConfidence: 73,
    },
    tomorrow: {
      title: "Soften the edges",
      summary: "Tomorrow asks you to be a little less hard on yourself. The work is already enough.",
      loveText: "Compliment received. Receive it without correcting it.",
      wealthText: "A small celebration is a productivity tool. Use it.",
      healthText: "Stretch the side you keep ignoring.",
      loveConfidence: 70,
      wealthConfidence: 72,
      healthConfidence: 76,
    },
  },
  libra: {
    yesterday: {
      title: "Held the balance",
      summary: "You mediated something yesterday and it cost you more than people saw.",
      loveText: "Your patience was the actual gift. They felt it.",
      wealthText: "A diplomatic email avoided a much larger problem.",
      healthText: "Take the recovery you actually need, not the polite amount.",
      loveConfidence: 72,
      wealthConfidence: 65,
      healthConfidence: 58,
    },
    today: {
      title: "Pick a side",
      summary:
        "Today balance comes from a decision, not from sitting still. Choose, and the rest of the room realigns around you.",
      loveText: "Tell them what you actually want. Vagueness has been costing you.",
      wealthText: "A long-deferred call becomes a quick yes once you make it.",
      healthText: "Less sugar, more water — your skin and your mood will trade up.",
      loveConfidence: 79,
      wealthConfidence: 74,
      healthConfidence: 66,
    },
    tomorrow: {
      title: "Aesthetic clarity",
      summary: "Tomorrow your eye for what's right is razor sharp — use it on your space, your schedule, your work.",
      loveText: "Plan something beautiful, not expensive.",
      wealthText: "Polish the portfolio piece you keep apologizing for.",
      healthText: "A clean room is also a calm nervous system.",
      loveConfidence: 76,
      wealthConfidence: 71,
      healthConfidence: 73,
    },
  },
  scorpio: {
    yesterday: {
      title: "True read",
      summary: "Your instincts about someone were right. File the data, don't broadcast it.",
      loveText: "A truth was gently named and it deepened, not damaged, the bond.",
      wealthText: "You spotted a risk in a deal — quiet credit, real value.",
      healthText: "Stress sat in your shoulders. Heat helps.",
      loveConfidence: 78,
      wealthConfidence: 72,
      healthConfidence: 61,
    },
    today: {
      title: "Cut clean",
      summary:
        "Today's gift is decisive subtraction. The thing you've been carrying out of guilt can be set down without a ceremony.",
      loveText: "Honesty over politeness. Be kind, but be honest.",
      wealthText: "Close the project that no longer pays you back.",
      healthText: "Breathwork — even five minutes — is a real intervention.",
      loveConfidence: 82,
      wealthConfidence: 80,
      healthConfidence: 67,
    },
    tomorrow: {
      title: "Quiet power",
      summary: "Tomorrow you have leverage you don't fully see yet. Move slowly and watch.",
      loveText: "Vulnerability is the fastest path forward this week.",
      wealthText: "Hold the line on the price; the better client is closer than you think.",
      healthText: "Sleep is the secret training session.",
      loveConfidence: 74,
      wealthConfidence: 78,
      healthConfidence: 71,
    },
  },
  sagittarius: {
    yesterday: {
      title: "Open road",
      summary: "A new idea kept you up — that's a good sign, not a bad one.",
      loveText: "A long conversation reminded you what kind of partnership you actually want.",
      wealthText: "A side project just earned its first real fan.",
      healthText: "Movement, even silly movement, was the right medicine.",
      loveConfidence: 70,
      wealthConfidence: 68,
      healthConfidence: 75,
    },
    today: {
      title: "Aim higher",
      summary:
        "Today rewards ambition with both feet on the ground. Big picture in the morning, small steps in the afternoon.",
      loveText: "Honesty about your goals attracts the right kind of company.",
      wealthText: "Pitch the bigger version. The smaller one was leaving money on the table.",
      healthText: "Outside time, ideally before noon.",
      loveConfidence: 73,
      wealthConfidence: 83,
      healthConfidence: 77,
    },
    tomorrow: {
      title: "Refine the map",
      summary: "Tomorrow's job is editing — keep the best three plans, drop the rest.",
      loveText: "Clarity about deal-breakers makes you more, not less, attractive.",
      wealthText: "A quiet scheduling change unlocks an entire month of focus.",
      healthText: "Less alcohol, better mornings — try it for a week.",
      loveConfidence: 71,
      wealthConfidence: 76,
      healthConfidence: 72,
    },
  },
  capricorn: {
    yesterday: {
      title: "Quiet mountain",
      summary: "You showed up. You always show up. Yesterday it counted twice.",
      loveText: "Reliability is, in fact, romantic. Someone noticed.",
      wealthText: "A small reputation win compounded into a real opportunity.",
      healthText: "You pushed too long without a break — adjust.",
      loveConfidence: 67,
      wealthConfidence: 81,
      healthConfidence: 58,
    },
    today: {
      title: "Compounding",
      summary:
        "Today the boring habit you've been keeping pays a real dividend. Don't celebrate too loud — keep going.",
      loveText: "Show, don't tell. They already know how you feel from your actions.",
      wealthText: "An invoice you forgot to chase will get paid this week.",
      healthText: "Carve out a real lunch. Calories standing don't count.",
      loveConfidence: 71,
      wealthConfidence: 86,
      healthConfidence: 66,
    },
    tomorrow: {
      title: "Plan a rest",
      summary: "Tomorrow asks you to schedule your recovery the way you schedule your meetings.",
      loveText: "Make a date you don't cancel.",
      wealthText: "Delegate one item you've been guarding. The team is ready.",
      healthText: "Bed by eleven — the next day is a different country.",
      loveConfidence: 68,
      wealthConfidence: 78,
      healthConfidence: 73,
    },
  },
  aquarius: {
    yesterday: {
      title: "New angle",
      summary: "An odd idea you had yesterday is the right one. Write the second draft.",
      loveText: "An unconventional gesture landed perfectly with the right person.",
      wealthText: "A long shot started to look not so long.",
      healthText: "Screen time stole an hour of sleep. Reclaim it tonight.",
      loveConfidence: 65,
      wealthConfidence: 70,
      healthConfidence: 60,
    },
    today: {
      title: "Build the future",
      summary:
        "Today is for prototypes, not perfection. Whatever you make today doesn't have to last forever — it just has to exist.",
      loveText: "Strangeness is the feature, not the bug. Lead with it.",
      wealthText: "An open-source contribution turns into a real introduction.",
      healthText: "Hydration is unglamorous and decisive. Drink the water.",
      loveConfidence: 70,
      wealthConfidence: 80,
      healthConfidence: 68,
    },
    tomorrow: {
      title: "Connect the dots",
      summary: "Tomorrow shows you a pattern across three things you thought were unrelated.",
      loveText: "An old friend turns out to be the right collaborator.",
      wealthText: "A research afternoon pays for itself ten times over.",
      healthText: "A walk and a podcast — old reliable.",
      loveConfidence: 73,
      wealthConfidence: 76,
      healthConfidence: 71,
    },
  },
  pisces: {
    yesterday: {
      title: "Soft signal",
      summary: "Your intuition was loud yesterday. It usually is — believe it sooner next time.",
      loveText: "A small tenderness arrived right when it was needed.",
      wealthText: "A creative idea you almost discarded was the actual gold.",
      healthText: "A quiet evening did real repair work.",
      loveConfidence: 78,
      wealthConfidence: 64,
      healthConfidence: 72,
    },
    today: {
      title: "Make the thing",
      summary:
        "Today the imagination is on. Ship a rough version of the thing you keep daydreaming about — perfect tomorrow, exist today.",
      loveText: "Express it through the work, not the explanation.",
      wealthText: "A creative side project finds its first paying audience this week.",
      healthText: "Water, music, light — an old recipe that still works.",
      loveConfidence: 76,
      wealthConfidence: 71,
      healthConfidence: 74,
    },
    tomorrow: {
      title: "Anchor the vision",
      summary: "Tomorrow the dream gets a deadline. That's a kindness, not a constraint.",
      loveText: "Plan the date you keep imagining. Reality is sweeter than you expect.",
      wealthText: "A boring spreadsheet protects a beautiful idea. Build it.",
      healthText: "A morning routine is, eventually, a personality.",
      loveConfidence: 74,
      wealthConfidence: 70,
      healthConfidence: 75,
    },
  },
};

const DAY_OFFSET: Record<DayMode, number> = {
  yesterday: -1,
  today: 0,
  tomorrow: 1,
};

function dateForDay(day: DayMode): string {
  const now = new Date();
  const target = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + DAY_OFFSET[day],
  );
  return target.toISOString();
}

/**
 * Returns a horoscope for `slug` and `day`, shaped like the DB row.
 * Replace the body with a real fetch when wiring the backend.
 */
export function getMockHoroscope(slug: ZodiacSlug, day: DayMode): MockHoroscope {
  const entry = MOCK[slug][day];
  return {
    zodiacSign: slug,
    date: dateForDay(day),
    ...entry,
  };
}
