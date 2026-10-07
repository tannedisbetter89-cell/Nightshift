export const PRODUCT_TYPES = [
  "guide",
  "prompt-pack",
  "template-kit",
  "checklist",
  "sop",
  "script-pack",
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];

export type ProductSource = "seed" | "factory" | "grok";

export type ProductSection = {
  heading: string;
  body: string;
};

export type ProductEmail = {
  subject: string;
  body: string;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  niche: string;
  type: ProductType;
  priceUsd: number;
  audience: string;
  listed: boolean;
  source: ProductSource;
  createdAt: number;
  sections: ProductSection[];
  salesPage: string;
  tweets: string[];
  emails: ProductEmail[];
  gumroadDescription: string;
  tags: string[];
  checkoutUrl?: string;
};

export const CHANNELS = ["gumroad", "stripe", "paypal", "manual"] as const;
export type Channel = (typeof CHANNELS)[number];

export const CHANNEL_LABEL: Record<Channel, string> = {
  gumroad: "Gumroad",
  stripe: "Stripe",
  paypal: "PayPal",
  manual: "Desk",
};

export type Sale = {
  id: string;
  productId: string;
  amount: number;
  note: string;
  at: number;
  channel?: Channel;
  customer?: string;
  sample?: boolean;
};

export type Activity = {
  id: string;
  at: number;
  kind: "mint" | "list" | "sale" | "cycle" | "system";
  title: string;
  detail: string;
};

export type Settings = {
  operatorName: string;
  shopName: string;
  payoutUrl: string;
  payoutLabel: string;
};

export const TYPE_LABEL: Record<ProductType, string> = {
  guide: "Guide",
  "prompt-pack": "Prompt pack",
  "template-kit": "Template kit",
  checklist: "Checklist",
  sop: "SOP pack",
  "script-pack": "Script pack",
};

export const CYCLE_SECONDS = 48;
export const VAULT_CAP = 28;
