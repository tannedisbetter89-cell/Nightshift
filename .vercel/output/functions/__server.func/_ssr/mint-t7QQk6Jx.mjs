import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { r as PRODUCT_TYPES } from "./types-C209mI6a.mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mint-t7QQk6Jx.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var MintInput = object({
	brief: string().min(12).max(480),
	type: _enum(PRODUCT_TYPES)
});
var SectionZ = object({
	heading: string(),
	body: string()
});
var EmailZ = object({
	subject: string(),
	body: string()
});
var MintedZ = object({
	title: string(),
	tagline: string(),
	niche: string(),
	type: _enum(PRODUCT_TYPES),
	priceUsd: number(),
	audience: string(),
	sections: array(SectionZ).min(3).max(6),
	salesPage: string(),
	tweets: array(string()).min(2).max(5),
	emails: array(EmailZ).min(1).max(3),
	gumroadDescription: string(),
	tags: array(string()).min(2).max(10)
});
function extractJson(text) {
	const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
	const raw = fenced ? fenced[1] : text;
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start === -1 || end === -1) throw new Error("No JSON object in response");
	return JSON.parse(raw.slice(start, end + 1));
}
var mintWithGrok_createServerFn_handler = createServerRpc({
	id: "460e3b767bef517ddce3134ffd3255b1ee36d1d8869e716a7334cb239cea598e",
	name: "mintWithGrok",
	filename: "src/lib/mint.ts"
}, (opts) => mintWithGrok.__executeServer(opts));
var mintWithGrok = createServerFn({ method: "POST" }).validator((input) => MintInput.parse(input)).handler(mintWithGrok_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Grok minting is not available in this environment."
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .8,
			max_tokens: 2200,
			messages: [{
				role: "system",
				content: "You write complete, sellable digital products for independent operators. Return ONLY JSON matching the schema. Tone: calm, specific, no hype, no emoji, no exclamation marks. Every section must be usable as-is. Prices are integers 12–49."
			}, {
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
}`
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Mint failed (${res.status}). Try again in a moment.`
	};
	const text = (await res.json()).choices?.[0]?.message?.content ?? "";
	try {
		return {
			ok: true,
			product: {
				...MintedZ.parse(extractJson(text)),
				type: data.type
			}
		};
	} catch {
		return {
			ok: false,
			error: "The mint came back malformed. Try a tighter brief."
		};
	}
});
//#endregion
export { mintWithGrok_createServerFn_handler };
