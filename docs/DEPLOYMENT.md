# Gavyadhenu deployment guide

## Architecture and portability

Gavyadhenu currently runs as a React 19 + Vite frontend with an Express server, tRPC contracts, Drizzle ORM, and MySQL/TiDB. The implementation intentionally preserves the existing working authentication, database, cart, order, portal, and Dhenu assistant functionality rather than replacing it with a parallel application. It is therefore **not a MongoDB/Mongoose MERN application today**; converting the persistence layer to MongoDB would be a separate migration with data-transfer and authentication risks.

The application is portable at the Node.js application level. It does not require the Manus WebDev runtime to build or run: install dependencies, provide the runtime variables, run the schema migration, build the frontend/server bundle, and start `dist/index.js`. Manus OAuth, built-in AI, and managed storage are optional integration adapters; production deployments should replace them with external OAuth, AI, and S3-compatible or Cloudinary adapters as described below.

## Local or external Node deployment

1. Copy the environment variable checklist from `docs/ENVIRONMENT.md` into the deployment provider’s secret/configuration UI. Never commit real credentials.
2. Provide a MySQL-compatible `DATABASE_URL` and a long random `JWT_SECRET`.
3. Install Node.js 20+ and pnpm, then run `pnpm install --frozen-lockfile`.
4. Generate/apply the Drizzle migrations with `pnpm db:push`.
5. Build with `pnpm build` and start with `pnpm start`.
6. Put the process behind HTTPS and configure the frontend API origin if the frontend and backend are deployed separately.

For Render/Railway, use `pnpm build` as the build command and `pnpm start` as the start command. The server listens on the provider’s `PORT` when configured by the host; the managed runtime uses the project’s existing server entrypoint.

## Frontend hosting

The current Vite build emits the frontend into `dist/public`. A single Node deployment can serve that output through the existing Express/Vite bridge. If deploying the frontend separately to Vercel or Netlify, configure the Vite build output, route all SPA paths to `index.html`, and point `VITE_API_URL` at the HTTPS backend origin. The current tRPC client remains the primary typed contract, while a small REST compatibility layer is included for external catalogue consumers.

The project now also exposes a small read-only REST compatibility surface for external storefronts: `GET /api/products?category=Kitchen&query=organic` and `GET /api/products/:slug`. These endpoints use the same approved catalogue queries as the storefront and return a neutral `{ data }` JSON envelope; protected cart, order, seller, and admin operations remain on the authenticated tRPC contract until a full REST controller migration is intentionally planned.

## External storage

Product image records store a URL string, so the application can use Cloudinary, S3, R2, or another public HTTPS object store. Replace managed storage paths in the seed/data with the external public URL and keep credentials server-side. Do not place private keys in `VITE_*` variables.

## Payments

Checkout is verification-first. COD orders remain `pending`; online payment records are created as `created` and must be advanced only by a Razorpay signature verification endpoint or webhook. Configure `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` before enabling an external payment adapter. Never mark an order paid from a browser callback alone.

## Operational checklist

Before launch, configure external OAuth or replace the Manus OAuth adapter, configure an external AI provider or disable Dhenu, configure SMTP for transactional email, configure object storage, enable Razorpay verification/webhooks, set restrictive CORS and HTTPS at the hosting layer, and run `pnpm check`, `pnpm test`, and `pnpm build` in CI.
