import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SEED_PRODUCTS } from "./catalog";
import { mintFromFactory } from "./factory";
import { buildSampleSales } from "./revenue";
import {
  CYCLE_SECONDS,
  VAULT_CAP,
  type Activity,
  type Channel,
  type Product,
  type Sale,
  type Settings,
} from "./types";
import { uid } from "./utils";

type NightshiftState = {
  hydrated: boolean;
  setHydrated: () => void;
  products: Product[];
  sales: Sale[];
  activity: Activity[];
  settings: Settings;
  autopilot: boolean;
  cycleLeft: number;
  serial: number;
  lastAiMintAt: number;
  aiMintsToday: number;
  aiMintsDay: string;
  deskOpen: boolean;
  sampleSeeded: boolean;
  setDeskOpen: (open: boolean) => void;
  toggleListed: (id: string) => void;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, patch: Partial<Pick<Product, "checkoutUrl" | "listed">>) => void;
  addProduct: (product: Product, kind: Activity["kind"]) => { ok: true } | { ok: false; error: string };
  mintLocal: () => { ok: true; product: Product } | { ok: false; error: string };
  logSale: (
    productId: string,
    amount: number,
    note: string,
    extra?: { channel?: Channel; customer?: string },
  ) => void;
  removeSale: (id: string) => void;
  clearSampleSales: () => void;
  setAutopilot: (on: boolean) => void;
  tick: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  noteAiMint: () => void;
};

const defaultSettings: Settings = {
  operatorName: "Operator",
  shopName: "Nightshift Shop",
  payoutUrl: "",
  payoutLabel: "Pay",
};

function pushActivity(list: Activity[], entry: Omit<Activity, "id" | "at">): Activity[] {
  return [{ id: uid("act"), at: Date.now(), ...entry }, ...list].slice(0, 48);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export const useNightshift = create<NightshiftState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      setHydrated: () => {
        const s = get();
        if (!s.sampleSeeded && s.sales.length === 0) {
          set({
            hydrated: true,
            sampleSeeded: true,
            sales: buildSampleSales(Date.now()),
            activity: pushActivity(s.activity, {
              kind: "system",
              title: "Sample ledger loaded",
              detail: "Ninety days of demo sales so the revenue desk has numbers. Remove any entry that isn’t yours.",
            }),
          });
          return;
        }
        set({ hydrated: true, sampleSeeded: true });
      },
      products: SEED_PRODUCTS,
      sales: buildSampleSales(Date.now()),
      activity: [
        {
          id: "act_boot",
          at: Date.now(),
          kind: "system",
          title: "Floor is live",
          detail: "Six products already on the shelf. Set a payout link, then start the factory.",
        },
        {
          id: "act_sample",
          at: Date.now() - 1000,
          kind: "system",
          title: "Sample ledger loaded",
          detail: "Ninety days of demo sales so the revenue desk has numbers. Remove any entry that isn’t yours.",
        },
      ],
      settings: defaultSettings,
      autopilot: false,
      cycleLeft: CYCLE_SECONDS,
      serial: 14,
      lastAiMintAt: 0,
      aiMintsToday: 0,
      aiMintsDay: todayKey(),
      deskOpen: false,
      sampleSeeded: true,
      setDeskOpen: (open) => set({ deskOpen: open }),
      toggleListed: (id) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, listed: !p.listed } : p)),
        })),
      updateProduct: (id, patch) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      removeProduct: (id) =>
        set((s) => ({
          products: s.products.filter((p) => p.id !== id),
          activity: pushActivity(s.activity, {
            kind: "system",
            title: "Pulled from vault",
            detail: s.products.find((p) => p.id === id)?.title ?? id,
          }),
        })),
      addProduct: (product, kind) => {
        const s = get();
        if (s.products.length >= VAULT_CAP) {
          return { ok: false as const, error: `Vault is at ${VAULT_CAP}. Archive one before minting.` };
        }
        set({
          products: [product, ...s.products],
          serial: s.serial + 1,
          activity: pushActivity(s.activity, {
            kind,
            title: `Minted · ${product.title}`,
            detail: `${product.niche} · $${product.priceUsd} · listed on the shop`,
          }),
        });
        return { ok: true as const };
      },
      mintLocal: () => {
        const s = get();
        if (s.products.length >= VAULT_CAP) {
          if (s.autopilot) {
            set({
              autopilot: false,
              activity: pushActivity(s.activity, {
                kind: "system",
                title: "Autopilot paused",
                detail: "Vault is full. Archive a product to start the factory again.",
              }),
            });
          }
          return { ok: false as const, error: `Vault is at ${VAULT_CAP}. Archive one before minting.` };
        }
        const titles = new Set(s.products.map((p) => p.title));
        const product = mintFromFactory(s.serial, titles);
        set({
          products: [product, ...s.products],
          serial: s.serial + 1,
          cycleLeft: CYCLE_SECONDS,
          activity: pushActivity(s.activity, {
            kind: "mint",
            title: `Factory minted · ${product.title}`,
            detail: `${product.niche} · $${product.priceUsd}`,
          }),
        });
        return { ok: true as const, product };
      },
      logSale: (productId, amount, note, extra) =>
        set((s) => {
          const product = s.products.find((p) => p.id === productId);
          const sale: Sale = {
            id: uid("sale"),
            productId,
            amount,
            note,
            at: Date.now(),
            channel: extra?.channel ?? "manual",
            customer: extra?.customer?.trim() || undefined,
          };
          return {
            sales: [sale, ...s.sales],
            activity: pushActivity(s.activity, {
              kind: "sale",
              title: `Collected $${amount}`,
              detail: product?.title ?? "Manual entry",
            }),
          };
        }),
      removeSale: (id) => set((s) => ({ sales: s.sales.filter((x) => x.id !== id) })),
      clearSampleSales: () =>
        set((s) => ({
          sales: s.sales.filter((sale) => !sale.sample),
          activity: pushActivity(s.activity, {
            kind: "system",
            title: "Sample sales removed",
            detail: "The desk now shows only money you logged.",
          }),
        })),
      setAutopilot: (on) =>
        set((s) => ({
          autopilot: on,
          cycleLeft: on ? s.cycleLeft || CYCLE_SECONDS : s.cycleLeft,
          activity: pushActivity(s.activity, {
            kind: "cycle",
            title: on ? "Autopilot on" : "Autopilot off",
            detail: on
              ? "The factory will mint a new product each cycle and list it in the shop."
              : "Factory idle. Inventory stays as-is.",
          }),
        })),
      tick: () => {
        const s = get();
        if (!s.autopilot) return;
        if (s.cycleLeft <= 1) {
          get().mintLocal();
          return;
        }
        set({ cycleLeft: s.cycleLeft - 1 });
      },
      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
      noteAiMint: () => {
        const day = todayKey();
        const s = get();
        set({
          lastAiMintAt: Date.now(),
          aiMintsDay: day,
          aiMintsToday: s.aiMintsDay === day ? s.aiMintsToday + 1 : 1,
        });
      },
    }),
    {
      name: "nightshift.v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        products: s.products,
        sales: s.sales,
        activity: s.activity,
        settings: s.settings,
        autopilot: s.autopilot,
        cycleLeft: s.cycleLeft,
        serial: s.serial,
        lastAiMintAt: s.lastAiMintAt,
        aiMintsToday: s.aiMintsToday,
        aiMintsDay: s.aiMintsDay,
        sampleSeeded: s.sampleSeeded,
      }),
    },
  ),
);

export function catalogValue(products: Product[]) {
  return products.filter((p) => p.listed).reduce((sum, p) => sum + p.priceUsd, 0);
}

export function collected(sales: Sale[]) {
  return sales.reduce((sum, s) => sum + s.amount, 0);
}

export function payUrl(product: Product, fallback: string) {
  const specific = product.checkoutUrl?.trim();
  return specific || fallback;
}
