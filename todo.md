# Gavyadhenu production multi-vendor upgrade

- [x] Audit existing auth, database, routers, routes, storefront, cart, checkout, and Dhenu AI.
- [x] Add relational models for customer, seller, product, cart, wishlist, orders, payments, addresses, notifications, reviews, payouts, and audit logs.
- [x] Implement server-side role authorization and ownership checks for customer, seller, and admin procedures.
- [x] Build dedicated customer, seller, and admin portal routes with working data-backed actions.
- [x] Upgrade product details, cart, checkout, and payment-ready order creation without falsely claiming payment success.
- [x] Add notifications and confirmation feedback for successful actions.
- [x] Validate with type checks, tests, production build, browser flows, and a saved checkpoint.
- [x] Verify the complete schema includes wishlist, reviews, payouts, and audit logs and apply the additive migration.
- [x] Verify backend notification writes for order placement, seller review, and product review decisions.

## Scope notes

- Preserve the existing storefront and Dhenu AI assistant.
- Use Manus OAuth/session infrastructure already present.
- Keep payment integration verification-first; do not mark orders paid from frontend state.
- Use managed storage paths for product imagery and user-uploaded media.
