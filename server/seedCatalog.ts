import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { products, sellerProfiles, users } from "../drizzle/schema";

const imageRoot = "/manus-storage/";
const launchProducts = [
  { name: "Bilona A2 Ghee", slug: "bilona-a2-ghee", sku: "GD-GHEE-500", category: "Kitchen", price: "899.00", mrp: "1099.00", stock: 24, imageUrl: `${imageRoot}gavyadhenu-bilona-ghee_a35cbf72.jpg`, description: "Hand-churned A2 ghee made in small batches for everyday cooking, warm rituals, and a kitchen that values the slow way." },
  { name: "Farmstead Makhana", slug: "farmstead-makhana", sku: "GD-MAKH-250", category: "Kitchen", price: "349.00", mrp: "425.00", stock: 38, imageUrl: `${imageRoot}gavyadhenu-makhana-packaging_6d5b5960.jpg`, description: "Slow-roasted makhana from a partner farm, presented in the Gavyadhenu packaging collection and ready for a quiet, nourishing snack." },
  { name: "Golden Haldi Ritual", slug: "golden-haldi-ritual", sku: "GD-HALD-100", category: "Wellness", price: "299.00", mrp: "349.00", stock: 42, imageUrl: `${imageRoot}gavyadhenu-lakadong-turmeric_da933be2.jpg`, description: "Lakadong turmeric powder for golden milk, warm infusions, and everyday kitchen wellness, shown with the provided Gavyadhenu product reference." },
  { name: "Farm Care Starter", slug: "farm-care-starter", sku: "GD-CARE-001", category: "Farm & Soil", price: "649.00", mrp: "799.00", stock: 15, imageUrl: null, description: "A practical starter set with minerals, herbal wash, and balm for a calmer, more attentive care routine." },
  { name: "Wildflower Honey", slug: "wildflower-honey", sku: "GD-HNY-250", category: "Kitchen", price: "549.00", mrp: "649.00", stock: 30, imageUrl: `${imageRoot}gavyadhenu-honey_477d1c08.jpg`, description: "Unfiltered wildflower honey gathered across changing blooms and bottled without unnecessary processing." },
  { name: "Earthen Home Candle", slug: "earthen-home-candle", sku: "GD-CNDL-180", category: "Home & Living", price: "799.00", mrp: "899.00", stock: 18, imageUrl: `${imageRoot}gavyadhenu-candle_376c034c.jpg`, description: "A soy wax candle with cedarwood warmth, made to give a quiet room a little more feeling." },
  { name: "Quiet Morning Brew", slug: "quiet-morning-brew", sku: "GD-BREW-040", category: "Wellness", price: "449.00", mrp: "549.00", stock: 26, imageUrl: `${imageRoot}gavyadhenu-brew_319df856.jpg`, description: "A single-origin herbal infusion for slower starts, clear pauses, and a more present morning." },
  { name: "The Living Gift Box", slug: "the-living-gift-box", sku: "GD-GIFT-004", category: "Gifting", price: "1499.00", mrp: "1799.00", stock: 12, imageUrl: `${imageRoot}gavyadhenu-gift-box_dd91f9ed.jpg`, description: "Four partner-farm favourites, thoughtfully gathered for someone who appreciates the trace behind a gift." },
  { name: "Wooden Ash Utensil Cleaner", slug: "wooden-ash-utensil-cleaner", sku: "GD-ASH-250", category: "Home & Living", price: "299.00", mrp: "349.00", stock: 28, imageUrl: `${imageRoot}gavyadhenu-wood-ash-cleaner_1c002b7f.jpg`, description: "A natural, chemical-free ash cleaner for utensils and a more considered home routine, based on the provided packaging reference." },
  { name: "Coconut Scrubber", slug: "coconut-scrubber", sku: "GD-SCRUB-001", category: "Home & Living", price: "199.00", mrp: "249.00", stock: 36, imageUrl: `${imageRoot}gavyadhenu-coconut-scrubber_d0546ffd.jpg`, description: "A durable coconut-fibre scrubber for everyday cleaning, designed as a plastic-free household essential." },
  { name: "Sattu Powder", slug: "sattu-powder", sku: "GD-SATTU-1000", category: "Kitchen", price: "299.00", mrp: "349.00", stock: 24, imageUrl: `${imageRoot}gavyadhenu-sattu-powder_0acb67eb.jpg`, description: "Roasted chana powder for traditional drinks and nourishing kitchen recipes, shown with the provided Gavyadhenu pack reference." },
  { name: "MP Sharbat Wheat Flour", slug: "mp-sharbat-wheat-flour", sku: "GD-WHEAT-1000", category: "Kitchen", price: "399.00", mrp: "449.00", stock: 20, imageUrl: `${imageRoot}gavyadhenu-wheat-flour_ca7e9026.jpg`, description: "Freshly milled wheat flour for everyday rotis and home cooking, with no added preservatives or chemicals represented in the reference packaging." },
  { name: "Red Chilli Powder", slug: "red-chilli-powder", sku: "GD-CHILLI-200", category: "Kitchen", price: "199.00", mrp: "249.00", stock: 32, imageUrl: `${imageRoot}gavyadhenu-red-chilli-powder_5a9a97b7.jpg`, description: "Handpicked, sun-dried red chilli powder for rich aroma and everyday Indian cooking, based on the provided label reference." },
  { name: "Coriander Powder", slug: "coriander-powder", sku: "GD-CORI-200", category: "Kitchen", price: "169.00", mrp: "199.00", stock: 32, imageUrl: `${imageRoot}gavyadhenu-coriander-powder_e9fff1e5.jpg`, description: "Ground coriander powder for warm, fragrant cooking and traditional kitchen recipes, based on the provided label reference." },
];

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await db.insert(users).values({ openId: "launch-partner-farm", name: "Gavyadhenu Partner Farm", email: "partners@gavyadhenu.in", loginMethod: "seed", role: "seller" }).onDuplicateKeyUpdate({ set: { role: "seller" } });
  const seller = (await db.select().from(users).where(eq(users.openId, "launch-partner-farm")).limit(1))[0];
  if (!seller) throw new Error("Could not create launch seller");
  await db.insert(sellerProfiles).values({ userId: seller.id, storeName: "Gavyadhenu Partner Farms", description: "A launch collection from growers and makers who value traceability, regenerative care, and useful everyday rituals.", phone: "+91 90000 00000", businessAddress: "Across partner farms in India", verificationStatus: "verified" }).onDuplicateKeyUpdate({ set: { verificationStatus: "verified" } });
  for (const item of launchProducts) {
    const existing = await db.select().from(products).where(eq(products.sku, item.sku)).limit(1);
    if (existing[0]) {
      await db.update(products).set({ name: item.name, slug: item.slug, imageUrl: item.imageUrl, description: item.description, price: item.price, mrp: item.mrp, stock: item.stock, status: "approved" }).where(eq(products.id, existing[0].id));
    } else {
      await db.insert(products).values({ ...item, sellerId: seller.id, status: "approved" });
    }
  }
  console.log(`Launch catalogue ready: ${launchProducts.length} products`);
  process.exit(0);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
