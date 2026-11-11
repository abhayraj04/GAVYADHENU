import type { Express } from "express";
import { ENV } from "./env";

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      // Graceful local fallback: map storage keys directly to high-res images so images always load
      const k = key.toLowerCase();
      if (k.includes("ghee")) return res.redirect(302, "/products/bilona-a2-ghee.jpg");
      if (k.includes("mustard")) return res.redirect(302, "/products/yellow-mustard-oil.jpg");
      if (k.includes("peanut") || k.includes("groundnut")) return res.redirect(302, "/products/groundnut-oil.jpg");
      if (k.includes("chilli") || k.includes("teja")) return res.redirect(302, "/products/teja-chilli-front.jpg");
      if (k.includes("black-turmeric") || k.includes("black_turmeric")) return res.redirect(302, "/products/black-turmeric-front.jpg");
      if (k.includes("coriander") || k.includes("dhaniya")) return res.redirect(302, "/products/coriander-powder-front.jpg");
      if (k.includes("lakadong") || k.includes("turmeric") || k.includes("haldi")) return res.redirect(302, "/products/lakadong-turmeric-front.jpg");
      if (k.includes("honey")) return res.redirect(302, "/products/wildflower-honey.jpg");
      if (k.includes("makhana")) return res.redirect(302, "/products/farmstead-makhana.jpg");
      if (k.includes("wheat") || k.includes("flour")) return res.redirect(302, "/products/mp-sharbati-wheat-flour.jpg");
      if (k.includes("sattu")) return res.redirect(302, "/products/sattu-powder.jpg");
      if (k.includes("candle")) return res.redirect(302, "/products/earthen-candle.jpg");
      if (k.includes("ash") || k.includes("cleaner")) return res.redirect(302, "/products/wood-ash-cleaner.jpg");
      if (k.includes("coconut") || k.includes("scrubber")) return res.redirect(302, "/products/coconut-scrubber.jpg");
      if (k.includes("brew") || k.includes("tulsi")) return res.redirect(302, "/products/quiet-morning-brew.jpg");
      if (k.includes("gift")) return res.redirect(302, "/products/the-living-gift-box.jpg");
      if (k.includes("pashu") || k.includes("care")) return res.redirect(302, "/products/pashu-starter-pack.jpg");
      return res.redirect(302, "/products/bilona-a2-ghee.jpg");
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
