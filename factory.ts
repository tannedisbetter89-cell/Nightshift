import { uid, slugify } from "./utils";
import type { Product, ProductType } from "./types";

type Niche = {
  name: string;
  audience: string;
  tags: string[];
  sections: { heading: string; body: string }[];
  tweets: string[];
  objection: string;
};

const NICHES: Niche[] = [
  {
    name: "Freelance operators",
    audience: "Independents selling design, writing, or development to small teams.",
    tags: ["freelance", "pricing", "clients"],
    objection: "I’ve always billed hourly and clients expect it.",
    tweets: [
      "Hourly billing is a story you tell when you haven’t named the artifact.",
      "A full calendar and an empty account is a pricing problem.",
      "Send the card. Don’t perform the price on the call.",
    ],
    sections: [
      {
        heading: "Name the artifact",
        body: "Write down what the client can hold when you’re done: a page, a deck, a working file, a decision. If you cannot screenshot it, you are still selling time. Pricing gets easy after the artifact has a name, a freeze date, and a revision cap.",
      },
      {
        heading: "Publish a ladder",
        body: "Three offers. Same family. Different surface area. The middle one should be the one you want. The small one exists so the discount request has somewhere to go besides your rate.",
      },
      {
        heading: "Payment that starts the work",
        body: "Fifty percent to calendar the work. Remainder on delivery. Do not start on a verbal yes. A kickoff without a deposit is a hobby with a client-shaped hole.",
      },
    ],
  },
  {
    name: "Newsletter writers",
    audience: "Writers who want the letter to pay, not just grow.",
    tags: ["newsletter", "audience", "monetization"],
    objection: "I need more subscribers before I charge.",
    tweets: [
      "A thousand readers who reply will beat ten thousand who scroll.",
      "Sell the artifact the letter is already training people to want.",
      "If the letter is free forever, you trained them that your thinking is free.",
    ],
    sections: [
      {
        heading: "Pick a paid sibling",
        body: "The letter stays free. The sibling is a kit, a critique, a small workshop, or a monthly desk. It should be the thing your best replies already ask for. Don’t invent a membership to look serious. Invent a file they can use on Tuesday.",
      },
      {
        heading: "Offer in the letter, not beside it",
        body: "One paragraph, once a week, below the actual point. Promise, artifact, price, link. No thread of eight pitches. Readers forgive a clear ask. They punish a funnel.",
      },
      {
        heading: "Price for a reply, not a list",
        body: "If 40 people would pay $29, that is a real product. Wait for 10,000 subscribers and you will wait through another year of ‘almost.’ Launch to the people who already write back.",
      },
    ],
  },
  {
    name: "Small studio owners",
    audience: "Two-to-six person studios drowning in Slack and undocumented work.",
    tags: ["studio", "ops", "sops"],
    objection: "We’re too busy to write this down.",
    tweets: [
      "If it lives in someone’s head, you don’t have a studio. You have a dependency.",
      "Write the path for the third time you do a thing. The first two can be messy.",
      "SOPs are how you stop hiring to cover confusion.",
    ],
    sections: [
      {
        heading: "Document the repeat, not the craft",
        body: "Onboarding, invoices, feedback collection, file naming, handoff. Leave the taste in people’s hands. Write down the path that keeps the taste from getting lost in a bad week.",
      },
      {
        heading: "One owner per path",
        body: "A process with two owners has none. Put a name on the SOP. The owner can be junior. The point is that Saturday-you is not the fallback.",
      },
      {
        heading: "Review quarterly, not constantly",
        body: "A living document that changes daily is a chat log. Freeze a version. Date it. Change it when a job actually breaks, not when someone has a new app.",
      },
    ],
  },
  {
    name: "Course-adjacent teachers",
    audience: "People who already teach and want a product that doesn’t need another live cohort.",
    tags: ["teaching", "digital products", "courses"],
    objection: "My students only show up live.",
    tweets: [
      "The cohort is expensive theater. The file is the business.",
      "Teach it live once. Sell the desk forever.",
      "If they only come live, you haven’t given them a tool they can open alone.",
    ],
    sections: [
      {
        heading: "Extract the desk",
        body: "List every file you already send a student: checklists, prompts, worksheets, example critiques. That’s the product. The videos are optional seasoning. Ship the desk first and you have something that sells at 11pm without you.",
      },
      {
        heading: "Name a 30-minute win",
        body: "The product should produce a visible result before the buyer finishes their coffee. A filled template, a scored audit, a drafted email. Courses fail when the win is ‘you’ll understand.’ Understanding is not an artifact.",
      },
      {
        heading: "Keep the live thing scarce",
        body: "If you still like teaching live, sell it as a rare add-on to the desk, not the other way around. The desk is the engine. The room is the event.",
      },
    ],
  },
  {
    name: "B2B operators",
    audience: "In-house operators who sell ideas upstairs and never get a decision.",
    tags: ["b2b", "internal", "decision memos"],
    objection: "My company doesn’t buy like that.",
    tweets: [
      "A memo that asks for a decision beats a deck that asks for a meeting.",
      "Upstairs wants the option, the cost, and the kill criteria. In that order.",
      "If there is no freeze date, there is no project. There is a vibe with a Slack channel.",
    ],
    sections: [
      {
        heading: "Write the decision, not the journey",
        body: "One page: context, options (max three), recommend one, cost, kill criteria, ask. Send it before the meeting. The meeting is then a yes, a no, or a better option — not a tour of your thinking.",
      },
      {
        heading: "Kill criteria",
        body: "Name what would make you stop. Budget, date, missing owner, a dependency that didn’t land. Executives relax when they see you already know how this dies. It signals you won’t nurse a zombie.",
      },
      {
        heading: "The follow-up that closes",
        body: "Same day, six lines: what was decided, who owns it, date, what’s out. If nothing was decided, write that down too. Silence lets the loudest person rewrite the meeting on Wednesday.",
      },
    ],
  },
  {
    name: "Shopkeepers going digital",
    audience: "Makers and shop owners adding a digital product beside the physical one.",
    tags: ["makers", "digital", "shops"],
    objection: "People come to me for the physical thing.",
    tweets: [
      "The physical thing gets them in. The file gets you paid at midnight.",
      "A care guide, a pattern, a setup kit — that’s inventory that doesn’t ship.",
      "Don’t build an app. Sell the thing you already explain in DMs.",
    ],
    sections: [
      {
        heading: "Mine the DMs",
        body: "The digital product is the question you already answer twice a week. Care, sizing, setup, ‘how did you do that,’ a pattern, a recipe. Write it once. Price it. Link it from the packing slip and the bio.",
      },
      {
        heading: "Bundle, don’t silo",
        body: "Offer the file as an add-on at checkout and as a standalone. The add-on captures people who already trust you. The standalone captures people who will never buy the object.",
      },
      {
        heading: "Fulfillment is a link",
        body: "Instant download. No custom wrapping. The quality bar is the same as your physical work — clean, named, usable — but the logistics bar is a URL. That is the point of this inventory.",
      },
    ],
  },
  {
    name: "Job-side hustlers",
    audience: "People with a day job who can give this 4 focused hours a week, not a fantasy of quitting Friday.",
    tags: ["side hustle", "time", "systems"],
    objection: "I don’t have time to build a business.",
    tweets: [
      "Four hours, same slot, every week. That’s a studio. The rest is a mood.",
      "Quit-your-job content is entertainment. A product that sells while you work is a plan.",
      "If it needs you live, it isn’t a hustle. It’s a second shift.",
    ],
    sections: [
      {
        heading: "Protect the slot",
        body: "Same four hours, same days, named on the calendar like a shift. During the slot you only mint, list, or close. No brand moodboards. No new stack. The constraint is the product.",
      },
      {
        heading: "One channel until it pays",
        body: "Pick Gumroad or the in-app shop or a single social account. Splitting attention across five platforms is how the slot evaporates. When one channel produces a sale, then duplicate the listing.",
      },
      {
        heading: "A 12-week finish line",
        body: "Week 1–2: pick the artifact. Week 3–4: mint it. Week 5: list it. Week 6–12: send it to people who already know you, once a week, without apology. Then review cash, not vibes.",
      },
    ],
  },
  {
    name: "Consultants productizing",
    audience: "Consultants who want a product in front of the call so the call is qualified.",
    tags: ["consulting", "productize", "offers"],
    objection: "My work is too custom to productize.",
    tweets: [
      "If you’ve done it three times, it isn’t custom. It’s unpublished.",
      "Sell the diagnostic. Keep the custom work for people who passed it.",
      "A $49 audit that stings is a better lead than a ‘let’s hop on a call.’",
    ],
    sections: [
      {
        heading: "Productize the front door",
        body: "The whole engagement can stay custom. The front door should not. A scored audit, a teardown, a 10-page diagnostic — priced, productized, instant. People who buy it are warmer than people who booked a coffee.",
      },
      {
        heading: "Score something",
        body: "Give the diagnostic a number. Buyers trust a score more than a narrative. Even a 12-point checklist with a 1–5 on each line is enough. Then sell the deeper work against the low scores.",
      },
      {
        heading: "Keep custom behind a gate",
        body: "The call is available after the diagnostic, or at a published day-rate. This stops tourists from renting your Tuesday. It also makes the product feel like the serious path, not a consolation prize.",
      },
    ],
  },
];

const FORMATS: {
  type: ProductType;
  title: (niche: string, hook: string) => string;
  tagline: (hook: string) => string;
  price: number;
  extraHeading: string;
  extraBody: (niche: Niche, hook: string) => string;
}[] = [
  {
    type: "guide",
    title: (n, h) => `${h} for ${n}`,
    tagline: (h) => `A short guide that makes ${h.toLowerCase()} a default, not a mood.`,
    price: 29,
    extraHeading: "How to run it this week",
    extraBody: (niche) =>
      `Block one session. Read the sections in order. Produce the artifact named in the first heading before you tinker with tools. ${niche.audience} already know the work — this is the sequence that stops the stall.`,
  },
  {
    type: "template-kit",
    title: (n, h) => `${h} Kit — ${n}`,
    tagline: (h) => `Fill-in fields. Send. ${h} without a blank page.`,
    price: 27,
    extraHeading: "What’s in the fields",
    extraBody: () =>
      "Highlighted brackets mark every place you type. Don’t restyle the kit on day one. Use it as-is on the next live job, then change one line that felt false. Kits die from premature taste.",
  },
  {
    type: "checklist",
    title: (_n, h) => `The ${h} Checklist`,
    tagline: (h) => `A close-out list so ${h.toLowerCase()} doesn’t leak into next week.`,
    price: 15,
    extraHeading: "How to run the list",
    extraBody: () =>
      "Print it or keep it at the top of a note. Check items in order. If you skip one, write why — that’s the leak. A checklist you rearrange every Friday is a journal.",
  },
  {
    type: "sop",
    title: (n, h) => `SOP: ${h} (${n})`,
    tagline: (h) => `The path you follow when you’re tired and ${h.toLowerCase()} still has to happen.`,
    price: 19,
    extraHeading: "Owners and freeze",
    extraBody: (niche) =>
      `Put a single owner on this path. Date the version. ${niche.audience} should be able to hand this to a future hire without a tour. If it needs a tour, it isn’t an SOP yet.`,
  },
  {
    type: "prompt-pack",
    title: (_n, h) => `Prompt Desk: ${h}`,
    tagline: (h) => `Prompts that return a ${h.toLowerCase()} artifact — not a chat.`,
    price: 24,
    extraHeading: "Refuse list",
    extraBody: () =>
      "Each prompt must refuse invented facts, fake quotes, and dates you didn’t supply. If the model fills a hole, that’s a bug in the prompt, not a feature. Keep [NEEDS FACT] markers in the output.",
  },
  {
    type: "script-pack",
    title: (_n, h) => `Scripts for ${h}`,
    tagline: (h) => `Copy-paste language for the moments ${h.toLowerCase()} usually goes sideways.`,
    price: 21,
    extraHeading: "How to send them",
    extraBody: () =>
      "Don’t memorize. Paste, then change one concrete detail so it sounds like you. Scripts fail when they’re performed. They work when they’re a document the other person can quote.",
  },
];

const HOOKS = [
  "The Quiet Close",
  "Fixed-Fee Monday",
  "After-Hours Inventory",
  "One-Page Offer",
  "Freeze Date",
  "The Kill List",
  "Inbox to Artifact",
  "Retainer Without Resentment",
  "First 30 Minutes",
  "No-Call Kickoff",
  "Scope That Holds",
  "The Paid Sibling",
];

function pick<T>(arr: T[], n: number): T {
  return arr[Math.abs(n) % arr.length]!;
}

export const TRENDS = NICHES.map((n, i) => ({
  niche: n.name,
  demand: 72 + ((i * 13) % 23),
  note: n.audience,
}));

export function mintFromFactory(serial: number, existingTitles: Set<string>): Product {
  let attempt = 0;
  let product: Product;
  do {
    const seed = serial + attempt * 17;
    const niche = pick(NICHES, seed);
    const format = pick(FORMATS, seed * 3);
    const hook = pick(HOOKS, seed * 5 + attempt);
    const title = format.title(niche.name, hook);
    const sections = [
      ...niche.sections,
      { heading: format.extraHeading, body: format.extraBody(niche, hook) },
      {
        heading: "The objection",
        body: `They will say: “${niche.objection}” Answer with the artifact, the freeze, and the price — not a story about your process. If they still want the old way, sell them the small ladder or walk.`,
      },
    ];
    product = {
      id: uid("mint"),
      slug: slugify(`${title}-${serial}-${attempt}`),
      title,
      tagline: format.tagline(hook),
      niche: niche.name,
      type: format.type,
      priceUsd: format.price,
      audience: niche.audience,
      listed: true,
      source: "factory",
      createdAt: Date.now(),
      sections,
      salesPage: `${title} is for ${niche.audience} You get a ${format.type.replace("-", " ")} built around ${hook.toLowerCase()} — the sequence, the language, and the freeze. Price is $${format.price}. Use it on the next live piece of work, not as a rainy-day read.`,
      tweets: niche.tweets,
      emails: [
        {
          subject: `${hook} is a document`,
          body: `Most people in ${niche.name.toLowerCase()} try to hold this in their head. This kit puts it on a page you can send. ${niche.audience}`,
        },
        {
          subject: `The ${format.type.replace("-", " ")} is live`,
          body: `It’s listed. It’s $${format.price}. The first 30 minutes are the point — open it, fill it, send it. If it sits in a folder, that’s on the week, not the file.`,
        },
      ],
      gumroadDescription: `${title}. ${format.tagline(hook)} Built for ${niche.audience} Includes the sequence, the language, and a written answer to “${niche.objection}”`,
      tags: [...niche.tags, format.type, hook.toLowerCase().replace(/\s+/g, "-")],
    };
    attempt += 1;
  } while (existingTitles.has(product.title) && attempt < 20);
  return product;
}

export function peekFromFactory(serial: number, existingTitles: Set<string>) {
  const product = mintFromFactory(serial, existingTitles);
  return {
    title: product.title,
    niche: product.niche,
    type: product.type,
    priceUsd: product.priceUsd,
    tagline: product.tagline,
  };
}

export function productFromGenerated(raw: {
  title: string;
  tagline: string;
  niche: string;
  type: ProductType;
  priceUsd: number;
  audience: string;
  sections: { heading: string; body: string }[];
  salesPage: string;
  tweets: string[];
  emails: { subject: string; body: string }[];
  gumroadDescription: string;
  tags: string[];
}): Product {
  return {
    id: uid("grok"),
    slug: slugify(raw.title),
    title: raw.title,
    tagline: raw.tagline,
    niche: raw.niche,
    type: raw.type,
    priceUsd: raw.priceUsd,
    audience: raw.audience,
    listed: true,
    source: "grok",
    createdAt: Date.now(),
    sections: raw.sections,
    salesPage: raw.salesPage,
    tweets: raw.tweets.slice(0, 4),
    emails: raw.emails.slice(0, 3),
    gumroadDescription: raw.gumroadDescription,
    tags: raw.tags.slice(0, 8),
  };
}
