import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PRODUCT_TYPES } from "./types";

const MintInput = z.object({
  brief: z.string().min(12).max(480),
  type: z.enum(PRODUCT_TYPES),
});

const SectionZ = z.object({
  heading: z.string(),
  body: z.string(),
});

const EmailZ = z.object({
  subject: z.string(),
  body: z.string(),
});

const MintedZ = z.object({
  title: z.string(),
  tagline: z.string(),
  niche: z.string(),
  type: z.enum(PRODUCT_TYPES),
  priceUsd: z.number(),
  audience: z.string(),
  sections: z.array(SectionZ).min(3).max(6),
  salesPage: z.string(),
  tweets: z.array(z.string()).min(2).max(5),
  emails: z.array(EmailZ).min(1).max(3),
  gumroadDescription: z.string(),
  tags: z.array(z.string()).min(2).max(10),
});

export type MintResult =
  | { ok: true; product: z.infer<typeof MintedZ> }
  | { ok: false; error: string };

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object in response");
  return JSON.parse(raw.slice(start, end + 1));
}

export const mintWithGrok = createServerFn({ method: "POST" })
  .validator((input: unknown) => MintInput.parse(input))
  .handler(async ({ data }): Promise<MintResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "Grok minting is not available in this environment." };
    }

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.8,
        max_tokens: 2200,
        messages: [
          {
            role: "system",
            content:
              "You write complete, sellable digital products for independent operators. Return ONLY JSON matching the schema. Tone: calm, specific, no hype, no emoji, no exclamation marks. Every section must be usable as-is. Prices are integers 12–49.",
          },
          {
            role: "user",
            content: `Mint a digital product.
Type: ${data.type}
Brief: ${data.brief}

JSON schema:
{
  "title": string,
  "tagline": string,
  "niche": string,
  "type": "${data.type}",
  "priceUsd": number,
  "audience": string (one sentence),
  "sections": [{ "heading": string, "body": string }] (4 or 5, each body 400-900 characters of real instruction),
  "salesPage": string (120-220 words),
  "tweets": string[3] (no hashtags),
  "emails": [{ "subject": string, "body": string }] (2),
  "gumroadDescription": string,
  "tags": string[4-7]
}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false, error: `Mint failed (${res.status}). Try again in a moment.` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content ?? "";
    try {
      const parsed = MintedZ.parse(extractJson(text));
      return { ok: true, product: { ...parsed, type: data.type } };
    } catch {
      return {
        ok: false,
        error: "The mint came back malformed. Try a tighter brief.",
      };
    }
  });
