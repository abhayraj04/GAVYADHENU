# Environment variable checklist

Use the deployment provider’s secret manager or local uncommitted `.env` file. The values below are names and purposes only; no credentials belong in source control.

| Variable | Purpose | Required |
|---|---|---:|
| `NODE_ENV` | `development` or `production` runtime mode | Yes |
| `PORT` | HTTP listener port supplied by the host | Yes in external hosting |
| `DATABASE_URL` | MySQL/TiDB connection string | Yes |
| `JWT_SECRET` | Session cookie signing secret | Yes |
| `VITE_APP_ID` | Existing OAuth application identifier | If using Manus OAuth |
| `OAUTH_SERVER_URL` | Existing OAuth server origin | If using Manus OAuth |
| `OWNER_OPEN_ID` / `OWNER_NAME` | Owner/admin bootstrap identity | If using existing OAuth |
| `RAZORPAY_KEY_ID` | Public Razorpay checkout identifier | For online payment |
| `RAZORPAY_KEY_SECRET` | Server-side Razorpay signing secret | For online payment |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signature verification secret | For online payment |
| `STORAGE_PROVIDER` | `s3`, `r2`, `cloudinary`, or another adapter name | For external storage |
| `S3_ENDPOINT` / `S3_REGION` / `S3_BUCKET` | S3-compatible object storage configuration | For S3/R2 |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | Server-side object storage credentials | For S3/R2 |
| `S3_PUBLIC_BASE_URL` | Public HTTPS prefix for stored images | For S3/R2 |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary storage configuration | For Cloudinary |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` | Transactional email transport | Optional |
| `SMTP_FROM` | Sender shown in order emails | Optional |
| `AI_API_KEY` / `OPENAI_API_KEY` | Server-side external AI provider key for Dhenu AI & Crop Doctor multimodal vision | Optional (Automatic deterministic fallback if unconfigured) |
| `BUILT_IN_FORGE_API_KEY` | Built-in AI acceleration provider key | Optional |
| `VITE_ANALYTICS_ENDPOINT` | Optional web analytics host origin | Optional |
| `VITE_ANALYTICS_WEBSITE_ID` | Optional web analytics site identifier | Optional |
| `VITE_API_URL` | Backend origin when frontend is hosted separately | Separate frontend only |

Never expose database, JWT, Razorpay secret, storage secret, SMTP password, or AI credentials through `VITE_*` variables.
