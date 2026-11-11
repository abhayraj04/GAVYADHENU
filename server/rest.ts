import type { Express, Request, Response } from "express";
import { getPublicProductBySlug, getPublicProducts } from "./db";

function queryString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function sendServerError(res: Response, error: unknown) {
  console.error("[REST] request failed", error);
  res.status(500).json({ message: "Something went wrong. Please try again later." });
}

export function registerRestRoutes(app: Express) {
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await getPublicProducts({ category: queryString(req.query.category), query: queryString(req.query.query) });
      res.json({ data: products });
    } catch (error) {
      sendServerError(res, error);
    }
  });

  app.get("/api/products/:slug", async (req: Request, res: Response) => {
    try {
      const product = await getPublicProductBySlug(req.params.slug);
      if (!product) {
        res.status(404).json({ message: "This product is currently unavailable." });
        return;
      }
      res.json({ data: product });
    } catch (error) {
      sendServerError(res, error);
    }
  });
}
