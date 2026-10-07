import type { Product } from "./types";

const t0 = 1_725_400_000_000;

export const SEED_PRODUCTS: Product[] = [
  {
    id: "seed_rate_card",
    slug: "fixed-fee-rate-card",
    title: "The Fixed-Fee Rate Card",
    tagline: "Price the work once. Stop leaking hours into ‘quick calls’.",
    niche: "Freelance operators",
    type: "template-kit",
    priceUsd: 27,
    audience: "Independent designers, writers, and developers who sell time and want to sell outcomes instead.",
    listed: true,
    source: "seed",
    createdAt: t0,
    tags: ["freelance", "pricing", "templates", "clients"],
    gumroadDescription:
      "A complete rate card and conversation kit for independents moving off hourly billing. Includes three pricing ladders, scope language, and the exact replies for ‘can you just…’.",
    salesPage:
      "Hourly billing trains clients to haggle your minutes. This kit replaces that with a one-page rate card, three offer ladders, and the language to hold the line when someone asks for a discount. Use it on the next inbound. Print it. Send it. Stop explaining your worth in 15-minute increments.",
    tweets: [
      "Stop selling hours. A one-page rate card makes the price a fact, not a negotiation.",
      "The discount request is a scope request in costume. Answer it with a smaller package, not a smaller number.",
      "If your calendar is full and your account is not, the leak is pricing — not pipeline.",
    ],
    emails: [
      {
        subject: "Your rate is a document, not a feeling",
        body: "Most independents undercharge because the number lives in their head. Put it on one page. Three packages. One line about what is not included. Send the page instead of improvising on the call.",
      },
      {
        subject: "A smaller package beats a smaller price",
        body: "When they ask you to come down, offer the middle ladder with the same delivery date. You keep the rate. They keep a decision. Nobody ‘meets in the middle’ on your rent.",
      },
    ],
    sections: [
      {
        heading: "How to use this kit",
        body: "Fill the rate card before you talk to anyone. Pick a flagship offer, a smaller sibling, and a retainer. The numbers should feel slightly high in your mouth — that is the point. Then send the card as a PDF or a single page in your proposal. Do not read it aloud. Let the page do the talking so you are not bargaining with your own voice.",
      },
      {
        heading: "Three-ladder pricing",
        body: "Lite: a defined artifact, one round of revisions, a hard delivery date. Standard: the artifact plus a working session and a 14-day polish window. Retainer: a monthly block with a published response time and a rollover cap of 20%. Name the packages after the outcome (Launch, Maintain, Expand) not after sizes (Bronze, Gold). Sizes invite comparison shopping. Outcomes invite a decision.",
      },
      {
        heading: "What is not included",
        body: "Write this as a short list, not a legal wall. Typical exclusions: extra stakeholder interviews, net-new pages after freeze, rush fees under 5 business days, tool licenses, and stock. When a request hits an exclusion, reply with the exclusion line plus a priced add-on. ‘That’s outside this package — I can add it for $X and shift delivery by Y days.’",
      },
      {
        heading: "Replies that hold the line",
        body: "‘Can you do it cheaper?’ → ‘I can do a smaller scope at the Lite price. Here’s what comes out.’\n‘We only have half the budget.’ → ‘Then we ship half the outcome. I’ll mark the cut in the card.’\n‘Just a quick call?’ → ‘Calls are billed as working sessions on Standard and Retainer. Happy to book one there.’\n‘Can you start this week?’ → ‘Rush is +35% and I confirm by 4pm today.’",
      },
      {
        heading: "The one-page card layout",
        body: "Header: your name, the offer family, the date. Row 1: three packages as columns. Row 2: what’s in, what’s out. Row 3: timeline and payment (50% to start, remainder on delivery). Footer: one sentence on who this is for, and a single next step (‘Reply with Lite, Standard, or Retainer’). Keep it to one screen. If it scrolls, you are still explaining.",
      },
    ],
  },
  {
    id: "seed_onboarding",
    slug: "client-onboarding-seven-messages",
    title: "Client Onboarding in 7 Messages",
    tagline: "From ‘you’re hired’ to first draft without a 90-minute kickoff.",
    niche: "Client services",
    type: "sop",
    priceUsd: 19,
    audience: "Solo operators who lose the first week of every job to scheduling, files, and unclear owners.",
    listed: true,
    source: "seed",
    createdAt: t0 + 1,
    tags: ["onboarding", "ops", "email", "clients"],
    gumroadDescription:
      "Seven copy-paste messages that take a new client from signed to briefing without a kickoff meeting. Includes intake, access, freeze date, and the first working update.",
    salesPage:
      "Kickoff meetings exist because the onboarding is sloppy. This SOP replaces the meeting with seven messages you send in order. The client answers in writing. You start with a brief you can quote later. The first week stops disappearing into calendar tennis.",
    tweets: [
      "If the brief isn’t written down, you don’t have a brief. You have a vibe.",
      "Kickoff calls are where scope goes to die. Put the questions in email. Freeze the answers.",
      "Onboarding is a product. Ship it the same way every time.",
    ],
    emails: [
      {
        subject: "You don’t need a kickoff. You need a freeze date.",
        body: "The first seven messages in this pack collect access, owners, constraints, and the freeze date. Once the freeze date is in writing, ‘one more thought’ becomes a change request.",
      },
      {
        subject: "The first working update",
        body: "Message 7 is a 6-line update: what moved, what’s blocked, what you need, when the next artifact lands. Send it even if nothing is blocked. Silence is how clients invent a story.",
      },
    ],
    sections: [
      {
        heading: "The sequence",
        body: "1. Welcome + invoice. 2. Access checklist. 3. Intake (10 questions, not 40). 4. Confirm owners and channels. 5. Freeze date + revision policy. 6. Working file location. 7. First update. Send one a day if they are slow. Send two a day if they are fast. Never batch all seven — they will skim and miss the freeze.",
      },
      {
        heading: "Message 3 — the only intake you need",
        body: "Ask: What does done look like in one sentence? Who says yes? Who can kill it? What must not change? What has already been tried? Where does this live when it’s finished? What would make this a failure? Deadline that is real vs. deadline that is a wish? Constraints on tools, brand, legal. Anything I will be surprised by in week two? If they write paragraphs, thank them and extract the one-sentence done.",
      },
      {
        heading: "Freeze language",
        body: "‘Inputs freeze on [date]. After that, new direction is a change request with a new date and a new number. I protect the freeze so your original deadline stays honest.’ Send this twice: in message 5 and in the footer of the first draft. People remember the second time.",
      },
      {
        heading: "When they want a call anyway",
        body: "Offer a 20-minute working session after messages 1–6 are complete. The call is then a review, not a scavenger hunt. If they insist on calling first, send the intake anyway and say you’ll use the call to confirm the written answers. You are training them to leave a paper trail you can both use.",
      },
    ],
  },
  {
    id: "seed_offer_page",
    slug: "the-quiet-offer-page",
    title: "The Quiet Offer Page",
    tagline: "A sales page that reads like a letter, not a carnival.",
    niche: "Digital products",
    type: "guide",
    priceUsd: 29,
    audience: "People selling a digital product, workshop, or service who hate loud landing pages and still need the page to close.",
    listed: true,
    source: "seed",
    createdAt: t0 + 2,
    tags: ["copy", "sales", "landing page", "offers"],
    gumroadDescription:
      "A structure for a one-screen offer page: promise, who it’s for, what’s inside, price, and the one objection. Written for people who will not use a countdown timer.",
    salesPage:
      "Most offer pages shout because the offer is vague. This guide gives you a quiet page: a specific buyer, a specific artifact, a specific price, and one honest objection handled in a sentence. You can ship it as a Gumroad description, a Notion page, or a single route on your site.",
    tweets: [
      "If the page needs a countdown, the offer isn’t clear enough to stand still.",
      "Name the buyer in the first line. Everyone else should feel politely excluded.",
      "Price is a sentence. Hide it and you teach people to hunt for the catch.",
    ],
    emails: [
      {
        subject: "One screen. One decision.",
        body: "Promise. Who. What’s inside. Price. Objection. Button. If a section doesn’t change the decision, cut it. Testimonials belong under the objection, not above the promise.",
      },
      {
        subject: "The buyer should feel excluded if they aren’t the buyer",
        body: "‘For independent operators who already have inbound’ is a better first line than ‘For anyone who wants more freedom.’ Specificity is a filter. Filters raise close rate.",
      },
    ],
    sections: [
      {
        heading: "The six blocks",
        body: "1. Promise in the buyer’s words. 2. Who this is for — and who it is not. 3. What’s inside, as artifacts not adjectives. 4. How they use it in the first 30 minutes. 5. Price, what’s included, what’s not. 6. The objection you actually hear, answered once. Stop after that. A longer page is usually a less decided offer.",
      },
      {
        heading: "Write the promise last",
        body: "Draft the contents list first. Then the 30-minute use. Then the buyer. The promise is a compression of those three. If you write the promise first you will invent contents to justify it. Buyers can feel the invention.",
      },
      {
        heading: "Price on the page",
        body: "Put the number next to the artifact, not in a toggle. If you have three packages, show three numbers in a row with one recommended. Do not ‘book a call to hear the price’ unless the work is truly custom — in which case this page should sell the call, and the call should still end on a card.",
      },
      {
        heading: "The one objection",
        body: "Pick the real one. For digital products it is usually ‘I won’t use it.’ Answer with the first 30 minutes: open the file, fill the highlighted fields, send it to one person. For services it is ‘I’ve been burned.’ Answer with freeze dates, revision caps, and a kill fee. One objection, handled. A FAQ of twelve is a nervous author.",
      },
    ],
  },
  {
    id: "seed_weekly_review",
    slug: "operator-weekly-review",
    title: "Operator Weekly Review",
    tagline: "A 25-minute close that tells you what to mint, ship, or kill.",
    niche: "Solo operators",
    type: "checklist",
    priceUsd: 15,
    audience: "People running a one-person operation who end the week busy and start the next one lost.",
    listed: true,
    source: "seed",
    createdAt: t0 + 3,
    tags: ["productivity", "review", "checklist", "operators"],
    gumroadDescription:
      "A Friday checklist: cash, pipeline, product, energy. Twenty-five minutes. No journaling. Includes the three questions that decide next week’s work.",
    salesPage:
      "A weekly review that isn’t a diary. You close the books on cash, name one leak, pick one ship, and park everything else. The output is a six-line note you can read on Monday without thinking.",
    tweets: [
      "If you don’t close the week, Monday inherits the mess and calls it a plan.",
      "Busy is not a metric. Cash, pipeline, and one shipped artifact are.",
      "Kill lists are more valuable than idea lists. Put them in the same note.",
    ],
    emails: [
      {
        subject: "Close the week like a shop",
        body: "Count the money. Count the unfinished. Name one thing that ships next week. Name one thing that dies. That’s the review. The rest is decoration.",
      },
      {
        subject: "Monday should start with a note, not a feeling",
        body: "The last box in this checklist is a six-line Monday note. Write it while the week is still in your body. Future-you is a stranger with less context.",
      },
    ],
    sections: [
      {
        heading: "The 25-minute close",
        body: "Minutes 0–5: cash in, cash promised, cash owed. Minutes 5–12: pipeline — what’s alive, what’s pretend. Minutes 12–18: product — what shipped, what’s rotting. Minutes 18–22: energy — what drained you that wasn’t worth it. Minutes 22–25: Monday note. Timer on. If you run over, you are journaling.",
      },
      {
        heading: "Three deciding questions",
        body: "What made money or will within 14 days? What was theater? If I could only do three things next week, which three still matter if nobody thanks me? The answers become the Monday note. Everything else goes to a parking list you are allowed to ignore.",
      },
      {
        heading: "The Monday note template",
        body: "1. Cash position in one line. 2. The ship. 3. The two supporting moves. 4. The kill. 5. One person to contact. 6. Off-limits (the drain you will not repeat). Stick this to the top of your task app. Do not rewrite it on Monday unless the facts changed.",
      },
      {
        heading: "What not to track",
        body: "Steps, inbox zero, hours in chair, ‘content ideas.’ Those metrics congratulate motion. This review only keeps numbers that survive contact with a bank account or a shipped file.",
      },
    ],
  },
  {
    id: "seed_proposal",
    slug: "proposal-kit-scope-creep",
    title: "Proposal Kit: Scope Without Scope Creep",
    tagline: "A proposal that already contains the change order.",
    niche: "Client services",
    type: "template-kit",
    priceUsd: 39,
    audience: "Independents whose projects swell because the proposal was a mood board.",
    listed: true,
    source: "seed",
    createdAt: t0 + 4,
    tags: ["proposals", "scope", "clients", "templates"],
    gumroadDescription:
      "Proposal sections, a scope freeze, revision math, and a change-order paragraph you can paste. Built to stop the project from doubling while the fee stays still.",
    salesPage:
      "Scope creep is a proposal problem. This kit gives you a document that names the artifact, the rounds, the freeze, and the price of leaving the rails. You send it once. When the extra request arrives, you already wrote the answer.",
    tweets: [
      "If it isn’t in the proposal, it’s a new job. Say that before you say yes.",
      "Revision rounds are a number. ‘Until it feels right’ is how you work weekends.",
      "A change order is a kindness. It keeps the original promise intact.",
    ],
    emails: [
      {
        subject: "Put the change order in the original PDF",
        body: "People behave better when the extra work has a price before they ask. This kit includes a one-paragraph change order. Leave it in. It signals you have done this before.",
      },
      {
        subject: "Two rounds. Then a number.",
        body: "Write ‘two rounds of consolidated feedback from one owner.’ Not ‘we’ll tweak until you’re happy.’ Happiness is not a scope.",
      },
    ],
    sections: [
      {
        heading: "The only sections that matter",
        body: "Context (5 lines). Artifact (what they can hold). Out of scope. Timeline with freeze. Rounds and owners. Price and payment. Change order. Next step. If you add a company history, you are soothing yourself. They skip it.",
      },
      {
        heading: "Artifact, not activity",
        body: "‘Six landing sections in Figma, desktop and one mobile frame, exported as a clickable prototype’ is an artifact. ‘Brand exploration and collaboration’ is a weather report. Write the thing they can screenshot when they forward your proposal upstairs.",
      },
      {
        heading: "Revision math",
        body: "Round 1: direction. Round 2: production polish. Feedback must arrive as one list from one owner within 3 business days or the date moves. Additional rounds: a published fee (e.g. $400) and +3 days. Put the fee in the proposal so it is not a surprise tax.",
      },
      {
        heading: "Change-order paragraph",
        body: "‘Work outside this artifact — extra pages, new stakeholders, new directions after freeze — is quoted before it starts. Typical adds are a fixed fee and a moved date. I will not begin extra work on a verbal yes.’ Paste it. Do not apologize for it.",
      },
      {
        heading: "The send",
        body: "PDF, not a Google Doc they can comment into mush. Subject: ‘Proposal — [artifact] — [price]’. Body: three sentences and a ask to reply with yes / questions / not now. Follow up once at 4 business days. Then park it. Chasing is a second job.",
      },
    ],
  },
  {
    id: "seed_prompt_desk",
    slug: "prompt-desk-client-deliverables",
    title: "Prompt Desk for Client Deliverables",
    tagline: "A desk of prompts that draft the work — not more chat.",
    niche: "AI-assisted client work",
    type: "prompt-pack",
    priceUsd: 24,
    audience: "Operators using a language model to draft client work who are tired of one-off prompts that wander.",
    listed: true,
    source: "seed",
    createdAt: t0 + 5,
    tags: ["ai", "prompts", "deliverables", "ops"],
    gumroadDescription:
      "Reusable prompt desks for briefs, outlines, first drafts, revision passes, and client updates. Each prompt asks for inputs and returns an artifact, not a conversation.",
    salesPage:
      "Chat is a trap. This pack is a desk: one prompt per artifact. You paste the inputs, you get a draft you can stand behind or cut. Built for client work where ‘sounds about right’ is not a delivery standard.",
    tweets: [
      "A good prompt names the artifact, the audience, and what to refuse.",
      "If you have to keep chatting, you didn’t specify the output.",
      "Use the model for the first 70%. Your name goes on the last 30%.",
    ],
    emails: [
      {
        subject: "Stop chatting. Start a desk.",
        body: "Each prompt in this pack has required inputs and a refuse list. The refuse list is how you keep the draft from inventing facts, testimonials, or timelines you didn’t give it.",
      },
      {
        subject: "Revision is a separate prompt",
        body: "Don’t continue the thread into mush. Open the revision prompt, paste the draft, paste the owner’s list, set the round number. You will get a cleaner pass.",
      },
    ],
    sections: [
      {
        heading: "How the desk works",
        body: "Every prompt has four parts you fill: context, artifact, constraints, refuse. Run it once. If the output is wrong, the inputs were thin — fix those, don’t argue with the model. Save a winning run as a named desk card so next week’s job starts from a known-good prompt.",
      },
      {
        heading: "Brief compressor",
        body: "Paste the messy email. Ask for: one-sentence done, owners, constraints, open questions, and a risk. Refuse: invented stakeholders, fake deadlines. Use the output as Message 3 in your onboarding, not as the final truth. Highlight anything the model inferred and confirm it.",
      },
      {
        heading: "First-draft prompt",
        body: "Inputs: audience, artifact, outline, examples of the client’s voice (paste 3 real sentences), facts that must appear, facts that must not be invented. Output: a complete draft with bracketed [NEEDS FACT] markers. Never let it smooth over a missing fact. The brackets are the point.",
      },
      {
        heading: "Revision pass",
        body: "Inputs: draft, owner feedback as a numbered list, round (1 or 2), what must stay. Instructions: address each numbered item or mark it as a conflict. Do not restyle the whole piece. A revision that rewrites everything is a new draft in costume.",
      },
      {
        heading: "Client update",
        body: "Inputs: what moved, what’s blocked, decision needed, next artifact and date. Output: 6 lines, no adjectives, no ‘hope you’re well.’ This is the same shape as a good status email. Send it even on quiet days so the client does not write the story for you.",
      },
    ],
  },
];

export function productToMarkdown(product: Product): string {
  const sections = product.sections
    .map((s) => `## ${s.heading}\n\n${s.body}`)
    .join("\n\n");
  const tweets = product.tweets.map((t) => `- ${t}`).join("\n");
  const emails = product.emails
    .map((e) => `### ${e.subject}\n\n${e.body}`)
    .join("\n\n");
  return `# ${product.title}

${product.tagline}

**Type:** ${product.type}
**Niche:** ${product.niche}
**Price:** $${product.priceUsd}
**For:** ${product.audience}

## Sales page

${product.salesPage}

${sections}

## Launch tweets

${tweets}

## Emails

${emails}

## Gumroad description

${product.gumroadDescription}

Tags: ${product.tags.join(", ")}
`;
}

export function gumroadListing(product: Product): string {
  return `${product.title}

${product.tagline}

${product.salesPage}

What's inside
${product.sections.map((s) => `• ${s.heading}`).join("\n")}

Who it's for
${product.audience}

Price: $${product.priceUsd}

${product.gumroadDescription}
`;
}

export function launchKit(product: Product): string {
  return `LAUNCH KIT — ${product.title}

TWEETS
${product.tweets.map((t, i) => `${i + 1}. ${t}`).join("\n\n")}

EMAILS
${product.emails.map((e) => `Subject: ${e.subject}\n${e.body}`).join("\n\n---\n\n")}

GUMROAD
${gumroadListing(product)}
`;
}

export function listingsPack(products: Product[]): string {
  return products.map((p) => gumroadListing(p)).join("\n\n---\n\n");
}

export function fulfillmentNote(product: Product): string {
  return `Thanks for buying ${product.title}.

Here’s the file. Open it, run the first section today, and reply if a field is unclear.

— Nightshift`;
}

export type LaunchMove = {
  day: string;
  title: string;
  body: string;
  copy?: string;
};

export function buildLaunchWeek(products: Product[]): LaunchMove[] {
  const listed = products.filter((p) => p.listed);
  const newest = listed[0];
  const second = listed[1] ?? listed[0];

  if (!newest) {
    return [
      {
        day: "Week",
        title: "Mint first",
        body: "Nothing is listed. Run the mill, list a product, then this week writes itself.",
      },
    ];
  }

  const emailOne = newest.emails[0];
  const emailTwo = newest.emails[1] ?? newest.emails[0];
  const tweetOne = newest.tweets[0] ?? newest.tagline;
  const tweetTwo = (second ?? newest).tweets[1] ?? (second ?? newest).tagline;

  return [
    {
      day: "Mon",
      title: `Tweet ${newest.title}`,
      body: tweetOne,
      copy: tweetOne,
    },
    {
      day: "Tue",
      title: "Send email one",
      body: emailOne ? `${emailOne.subject} — ${emailOne.body}` : newest.salesPage,
      copy: emailOne ? `Subject: ${emailOne.subject}\n\n${emailOne.body}` : undefined,
    },
    {
      day: "Wed",
      title: "Share the shop",
      body: `Send the shop to five people who already trust you. Caption: ${newest.tagline}`,
      copy: newest.tagline,
    },
    {
      day: "Thu",
      title: `Tweet ${second.title}`,
      body: tweetTwo,
      copy: tweetTwo,
    },
    {
      day: "Fri",
      title: "Send email two",
      body: emailTwo ? `${emailTwo.subject} — ${emailTwo.body}` : "Follow up once. Then stop.",
      copy: emailTwo ? `Subject: ${emailTwo.subject}\n\n${emailTwo.body}` : undefined,
    },
    {
      day: "Sat",
      title: "Quiet replies",
      body: "Answer every reply and DM about the product. Do not post a third pitch. Fulfill anything that paid.",
    },
    {
      day: "Sun",
      title: "Close the week",
      body: "Log cash in the ledger. Kill the listing that got no questions. Keep the one that did.",
    },
  ];
}
