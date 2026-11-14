// Complete photo galleries for all Gavyadhenu products using verified authentic photography and studio packaging
export const PRODUCT_GALLERIES: Record<string, string[]> = {
  "bilona-a2-ghee": [
    "/products/bilona-a2-ghee.jpg",
    "/products/bilona-a2-ghee-texture.jpg",
    "/products/bilona-a2-ghee-churn.jpg",
    "/products/bilona-a2-ghee-back.jpg",
  ],
  "farmstead-makhana": [
    "/products/farmstead-makhana.jpg",
    "/products/farmstead-makhana-bowl.jpg",
    "/products/farmstead-makhana-wetland.jpg",
    "/products/farmstead-makhana-back.jpg",
  ],
  "golden-haldi-ritual": [
    "/products/lakadong-turmeric-front.jpg",
    "/products/lakadong-turmeric-side.jpg",
    "/products/lakadong-turmeric-farm.jpg",
    "/products/lakadong-turmeric-back.jpg",
  ],
  "wildflower-honey": [
    "/products/wildflower-honey.jpg",
    "/products/wildflower-honey-drip.jpg",
    "/products/wildflower-honey-comb.jpg",
    "/products/wildflower-honey-back.jpg",
  ],
  "earthen-home-candle": [
    "/products/earthen-candle.jpg",
    "/products/earthen-candle-flame.jpg",
    "/products/earthen-candle-artisan.jpg",
    "/products/earthen-candle-botanical.jpg",
  ],
  "farm-care-starter": [
    "/products/pashu-starter-pack.jpg",
    "/products/pashu-starter-spray.jpg",
    "/products/pashu-starter-balm.jpg",
    "/products/pashu-starter-lick.jpg",
  ],
  "quiet-morning-brew": [
    "/products/quiet-morning-brew.jpg",
    "/products/quiet-morning-brew-leaves.jpg",
    "/products/quiet-morning-brew-cup.jpg",
    "/products/quiet-morning-brew-back.jpg",
  ],
  "the-living-gift-box": [
    "/products/the-living-gift-box.jpg",
    "/products/the-living-gift-box-open.jpg",
    "/products/the-living-gift-box-detail.jpg",
    "/products/the-living-gift-box-lifestyle.jpg",
  ],
  "wooden-ash-utensil-cleaner": [
    "/products/wood-ash-cleaner.jpg",
    "/products/wood-ash-cleaner-texture.jpg",
    "/products/wood-ash-cleaner-action.jpg",
    "/products/wood-ash-cleaner-back.jpg",
  ],
  "coconut-scrubber": [
    "/products/coconut-scrubber.jpg",
    "/products/coconut-scrubber-close.jpg",
    "/products/coconut-scrubber-use.jpg",
    "/products/coconut-scrubber-eco.jpg",
  ],
  "sattu-powder": [
    "/products/sattu-powder.jpg",
    "/products/sattu-powder-chana.jpg",
    "/products/sattu-powder-drink.jpg",
    "/products/sattu-powder-back.jpg",
  ],
  "mp-sharbat-wheat-flour": [
    "/products/mp-sharbati-wheat-flour.jpg",
    "/products/mp-sharbati-wheat-flour-grain.jpg",
    "/products/mp-sharbati-wheat-flour-roti.jpg",
    "/products/mp-sharbati-wheat-flour-back.jpg",
  ],
  "wood-pressed-yellow-mustard-oil": [
    "/products/yellow-mustard-oil.jpg",
    "/products/yellow-mustard-oil-seeds.jpg",
    "/products/yellow-mustard-oil-pour.jpg",
    "/products/yellow-mustard-oil-back.jpg",
  ],
  "wood-pressed-groundnut-oil": [
    "/products/groundnut-oil.jpg",
    "/products/groundnut-oil-peanuts.jpg",
    "/products/groundnut-oil-pour.jpg",
    "/products/groundnut-oil-back.jpg",
  ],
  "teja-red-chilli-powder": [
    "/products/teja-chilli-front.jpg",
    "/products/teja-chilli-side.jpg",
    "/products/teja-chilli-texture.jpg",
    "/products/teja-chilli-back.jpg",
  ],
  "raw-black-turmeric-powder": [
    "/products/black-turmeric-front.jpg",
    "/products/black-turmeric-angle.jpg",
    "/products/black-turmeric-rhizome.jpg",
    "/products/black-turmeric-back.jpg",
  ],
  "stone-ground-coriander-powder": [
    "/products/coriander-powder-front.jpg",
    "/products/coriander-powder-seeds.jpg",
    "/products/coriander-powder-curry.jpg",
    "/products/coriander-powder-back.jpg",
  ],
};

export function getProductPhotos(slug: string, fallbackUrl?: string | null): string[] {
  if (PRODUCT_GALLERIES[slug] && PRODUCT_GALLERIES[slug].length > 0) {
    return PRODUCT_GALLERIES[slug];
  }
  return fallbackUrl ? [fallbackUrl] : [];
}

export function getProductThumbnail(slug: string, fallbackUrl?: string | null): string {
  const photos = getProductPhotos(slug, fallbackUrl);
  return photos[0] || fallbackUrl || "/gavyadhenu-logo.png";
}
