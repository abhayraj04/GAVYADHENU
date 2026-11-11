// Complete photo galleries for all Gavyadhenu products using verified authentic photography and studio packaging
export const PRODUCT_GALLERIES: Record<string, string[]> = {
  "bilona-a2-ghee": [
    "/products/bilona-a2-ghee.jpg",
    "/products/pashu-starter-pack.jpg",
  ],
  "wood-pressed-yellow-mustard-oil": [
    "/products/yellow-mustard-oil.jpg",
    "/products/yellow-mustard-oil-seeds.jpg",
  ],
  "wood-pressed-groundnut-oil": [
    "/products/groundnut-oil.jpg",
    "/products/groundnut-oil-peanuts.jpg",
  ],
  "golden-haldi-ritual": [
    "/products/lakadong-turmeric-front.jpg",
    "/products/lakadong-turmeric-side.jpg",
    "/products/lakadong-turmeric-back.jpg",
    "/products/yellow-mustard-oil-seeds.jpg",
  ],
  "teja-red-chilli-powder": [
    "/products/teja-chilli-front.jpg",
    "/products/teja-chilli-side.jpg",
    "/products/teja-chilli-back.jpg",
    "/products/yellow-mustard-oil-seeds.jpg",
  ],
  "raw-black-turmeric-powder": [
    "/products/black-turmeric-front.jpg",
    "/products/black-turmeric-angle.jpg",
    "/products/black-turmeric-back.jpg",
  ],
  "stone-ground-coriander-powder": [
    "/products/coriander-powder-front.jpg",
    "/products/coriander-powder-back.jpg",
    "/products/coriander-powder-seeds.jpg",
  ],
  "wildflower-honey": [
    "/products/wildflower-honey.jpg",
    "/products/wildflower-honey-drip.jpg",
  ],
  "farmstead-makhana": [
    "/products/farmstead-makhana.jpg",
    "/products/farmstead-makhana-bowl.jpg",
  ],
  "sattu-powder": [
    "/products/sattu-powder.jpg",
  ],
  "mp-sharbat-wheat-flour": [
    "/products/mp-sharbati-wheat-flour.jpg",
  ],
  "quiet-morning-brew": [
    "/products/quiet-morning-brew.jpg",
    "/products/quiet-morning-brew-leaves.jpg",
  ],
  "earthen-home-candle": [
    "/products/earthen-candle.jpg",
    "/products/earthen-candle-flame.jpg",
  ],
  "the-living-gift-box": [
    "/products/the-living-gift-box.jpg",
    "/products/bilona-a2-ghee.jpg",
    "/products/lakadong-turmeric-front.jpg",
  ],
  "wooden-ash-utensil-cleaner": [
    "/products/wood-ash-cleaner.jpg",
  ],
  "coconut-scrubber": [
    "/products/coconut-scrubber.jpg",
  ],
  "farm-care-starter": [
    "/products/pashu-starter-pack.jpg",
    "/products/pashu-starter-spray.jpg",
  ],
};

export function getProductPhotos(slug: string, fallbackUrl?: string | null): string[] {
  if (PRODUCT_GALLERIES[slug] && PRODUCT_GALLERIES[slug].length > 0) {
    return PRODUCT_GALLERIES[slug];
  }
  return fallbackUrl ? [fallbackUrl] : [];
}
