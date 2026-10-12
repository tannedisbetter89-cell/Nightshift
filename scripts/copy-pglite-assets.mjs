#!/usr/bin/env node
/**
 * Copy PGLite's WASM/data assets into the Nitro server bundle.
 *
 * The bundler inlines `@electric-sql/pglite`'s JS but not its `.wasm`/`.data`
 * files, which PGLite reads from disk at runtime. Without them, any database
 * access crashes the production bundle when DATABASE_URL is unset (the local
 * PGLite fallback path). On Vercel with DATABASE_URL set (Neon), PGLite never
 * initializes and these files sit unused — copying them is harmless there.
 *
 * Runs as part of `npm run build`, after `vite build`.
 */
import { copyFile, mkdir, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "package.json"));

async function main() {
  let pgliteDist;
  try {
    pgliteDist = join(dirname(require.resolve("@electric-sql/pglite/package.json")), "dist");
  } catch {
    // Fallback: resolve the well-known install location directly.
    pgliteDist = join(root, "node_modules", "@electric-sql", "pglite", "dist");
  }
  const libsDir = join(root, ".vercel", "output", "functions", "__server.func", "_libs");
  let entries;
  try {
    entries = await readdir(pgliteDist);
  } catch {
    console.log("[pglite-assets] pglite dist not found — skipping.");
    return;
  }
  const assets = entries.filter((f) => f.endsWith(".wasm") || f.endsWith(".data"));
  if (!assets.length) {
    console.log("[pglite-assets] no WASM/data assets found — skipping.");
    return;
  }
  await mkdir(libsDir, { recursive: true });
  for (const file of assets) {
    await copyFile(join(pgliteDist, file), join(libsDir, file));
  }
  console.log(`[pglite-assets] copied ${assets.length} file(s) to the server bundle.`);
}

main().catch((err) => {
  console.error("[pglite-assets] failed:", err?.message || err);
  process.exit(1);
});
