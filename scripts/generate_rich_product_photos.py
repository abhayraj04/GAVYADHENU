import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = "client/public/products"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_font(size, bold=False):
    for f in ["C:/Windows/Fonts/georgiab.ttf" if bold else "C:/Windows/Fonts/georgia.ttf",
              "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"]:
        if os.path.exists(f):
            try:
                return ImageFont.truetype(f, size)
            except:
                pass
    return ImageFont.load_default()

def draw_vignette(draw, w, h):
    # Soft warm lighting
    for i in range(15):
        alpha = int((15 - i) * 3)
        draw.rectangle([i*4, i*4, w - i*4, h - i*4], outline=(245, 238, 222), width=4)

def create_rich_card(filename, title, subtitle, main_color, accent_color, item_type, notes):
    """
    Creates an authentic, warm, studio-lit photo card for product details (800x800)
    """
    w, h = 800, 800
    im = Image.new("RGB", (w, h), (247, 243, 235))
    draw = ImageDraw.Draw(im)

    # Gradient background
    for y in range(h):
        ratio = y / h
        r = int(248 * (1 - ratio*0.15))
        g = int(243 * (1 - ratio*0.18))
        b = int(235 * (1 - ratio*0.22))
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # Wooden table / kitchen surface at bottom
    table_top = int(h * 0.62)
    for y in range(table_top, h):
        ty = (y - table_top) / (h - table_top)
        tr = int(145 + ty * 25)
        tg = int(105 + ty * 20)
        tb = int(75 + ty * 15)
        draw.line([(0, y), (w, y)], fill=(tr, tg, tb))
    
    # Table edge highlight & shadow
    draw.line([(0, table_top), (w, table_top)], fill=(185, 145, 105), width=3)
    draw.line([(0, table_top + 3), (w, table_top + 3)], fill=(95, 65, 45), width=2)

    # Brass / earthen background props
    # Warm brass vessel on left
    draw.ellipse([30, 220, 160, 480], fill=(210, 165, 80), outline=(160, 115, 45), width=3)
    draw.ellipse([45, 200, 145, 240], fill=(230, 190, 105), outline=(170, 125, 55), width=2)
    # Plant foliage on right
    for dx, dy in [(680, 260), (710, 310), (660, 350), (730, 390)]:
        draw.ellipse([dx, dy, dx+65, dy+35], fill=(75, 115, 60))
        draw.line([(dx+32, dy+17), (dx+75, dy+25)], fill=(45, 85, 35), width=2)

    # Central subject box / jar / element
    cx, cy = 400, 420

    if item_type == "seeds":
        # Wooden bowl with whole seeds / grains
        draw.ellipse([cx - 180, cy - 20, cx + 180, cy + 180], fill=(95, 60, 35), outline=(140, 95, 55), width=4)
        draw.ellipse([cx - 165, cy, cx + 165, cy + 155], fill=main_color)
        # Seed particles
        import random
        random.seed(42)
        for _ in range(250):
            sx = random.randint(cx - 140, cx + 140)
            sy = random.randint(cy + 20, cy + 140)
            sr = random.randint(4, 9)
            draw.ellipse([sx, sy, sx + sr, sy + sr], fill=accent_color, outline=(120, 80, 40))

    elif item_type == "mortar":
        # Traditional stone chakki / mortar pestle
        draw.ellipse([cx - 160, cy + 40, cx + 160, cy + 170], fill=(130, 130, 125), outline=(90, 90, 85), width=5)
        draw.ellipse([cx - 130, cy + 65, cx + 130, cy + 145], fill=main_color)
        # Wooden pestle
        draw.rectangle([cx - 20, cy - 100, cx + 20, cy + 90], fill=(110, 70, 40), outline=(75, 45, 25), width=3)
        draw.ellipse([cx - 25, cy - 110, cx + 25, cy - 90], fill=(135, 90, 55))

    elif item_type == "churn":
        # Earthen matka with bilona churner
        draw.ellipse([cx - 150, cy - 40, cx + 150, cy + 180], fill=(175, 95, 60), outline=(130, 65, 40), width=5)
        draw.ellipse([cx - 110, cy - 70, cx + 110, cy - 30], fill=(245, 215, 110)) # Golden ghee froth
        # Bilona wooden stick
        draw.line([(cx, cy - 200), (cx, cy - 30)], fill=(90, 55, 30), width=16)
        draw.ellipse([cx - 14, cy - 220, cx + 14, cy - 190], fill=(115, 75, 40))

    elif item_type == "food":
        # Cooked rotis or snacks on brass plate
        draw.ellipse([cx - 190, cy - 10, cx + 190, cy + 170], fill=(215, 175, 85), outline=(170, 130, 55), width=5)
        draw.ellipse([cx - 160, cy + 10, cx + 160, cy + 150], fill=(245, 230, 180), outline=(210, 170, 110), width=3)
        # Golden spots
        for ox, oy in [(-50, 60), (40, 80), (-20, 110), (70, 50), (-80, 80)]:
            draw.ellipse([cx + ox, cy + oy, cx + ox + 22, cy + oy + 16], fill=(185, 130, 60))

    elif item_type == "lifestyle":
        # Candle or gift hamper or artisan care item
        draw.ellipse([cx - 130, cy + 20, cx + 130, cy + 150], fill=(170, 100, 65), outline=(125, 70, 45), width=4)
        draw.ellipse([cx - 110, cy + 35, cx + 110, cy + 120], fill=main_color)
        # Flame or glowing element
        draw.ellipse([cx - 18, cy - 50, cx + 18, cy + 30], fill=(255, 205, 50))
        draw.ellipse([cx - 8, cy - 35, cx + 8, cy + 15], fill=(255, 245, 210))

    # Hanging tag or badge
    f_tag = get_font(13, bold=True)
    f_title = get_font(26, bold=True)
    f_sub = get_font(16, bold=False)
    f_note = get_font(13, bold=False)

    # Top brand bar
    draw.rectangle([cx - 200, 35, cx + 200, 75], fill=(25, 56, 38), outline=(200, 160, 80), width=2)
    draw.text((cx, 55), "GAVYADHENU · CELEBRATING BHARAT", fill=(245, 235, 210), font=f_tag, anchor="mm")

    # Bottom parchment info overlay
    draw.rectangle([40, 640, 760, 760], fill=(255, 253, 248), outline=(200, 165, 110), width=2)
    draw.text((cx, 672), title, fill=(25, 56, 38), font=f_title, anchor="mm")
    draw.text((cx, 706), subtitle, fill=(90, 70, 50), font=f_sub, anchor="mm")
    draw.text((cx, 736), notes, fill=(120, 100, 80), font=f_note, anchor="mm")

    # Save
    outpath = os.path.join(OUTPUT_DIR, filename)
    im.save(outpath, "JPEG", quality=92)
    print(f"Generated photo: {outpath} ({os.path.getsize(outpath)} bytes)")

# 1. Bilona Ghee 4th photo
create_rich_card(
    "bilona-a2-ghee-churn.jpg",
    "Traditional Vedic Bilona Churning",
    "Slow-churned bi-directionally in clay pots over cow-dung fire",
    (245, 205, 95), (255, 225, 130), "churn",
    "100% Indigenous Gir Cow A2 Curd · Zero Mechanical Processing"
)

# 2. Yellow Mustard Oil 4th photo
create_rich_card(
    "yellow-mustard-oil-seeds.jpg",
    "Select Organic Yellow Mustard Seeds",
    "Cold wood pressed (Kolhu) at below 45°C to preserve pungent allyl isothiocyanate",
    (210, 175, 60), (145, 110, 30), "seeds",
    "Zero Chemicals · Zero Argemone · Natural Digestive Warmth"
)

# 3. Groundnut Oil 4th photo
create_rich_card(
    "groundnut-oil-peanuts.jpg",
    "Saurashtra Golden Groundnut Harvest",
    "Slow extracted in traditional wooden Ghani to retain natural nutty aroma & Vitamin E",
    (190, 140, 90), (140, 95, 55), "seeds",
    "Unrefined & Virgin · High Smoke Point · 100% Pure"
)

# 4. Lakadong Turmeric 4th photo
create_rich_card(
    "lakadong-turmeric-farm.jpg",
    "High-Curcumin (7.5%+) Lakadong Rhizomes",
    "Grown in pristine Jaintia Hills, Meghalaya · Ancient stone ground preservation",
    (225, 135, 20), (160, 80, 10), "mortar",
    "Tested Purity · No Added Lead Chromate · Natural Healing"
)

# 5. Teja Red Chilli 4th photo
create_rich_card(
    "teja-chilli-texture.jpg",
    "Authentic Guntur Teja Red Chillies",
    "Sun-dried on clean mats and stone-ground to retain fiery pungent capsicum",
    (185, 45, 25), (130, 25, 15), "mortar",
    "Zero Artificial Red Dyes · High Heat & Natural Aroma"
)

# 6. Raw Black Turmeric 4th photo
create_rich_card(
    "black-turmeric-rhizome.jpg",
    "Sacred Wild Black Turmeric Rhizomes",
    "Rare Curcuma Caesia with deep indigo-violet interior · Potent Ayurvedic herb",
    (85, 45, 80), (120, 70, 115), "mortar",
    "Rich in Bioactive Antioxidants · Stone-Ground Freshness"
)

# 7. Coriander Powder 3rd & 4th photos
create_rich_card(
    "coriander-powder-seeds.jpg",
    "Aromatic Whole Coriander Seeds",
    "Slow stone chakki ground to retain delicate fragrant linalool essential oils",
    (180, 150, 75), (135, 105, 45), "seeds",
    "Soothing Digestive Balance · 100% Pure · Zero Fillers"
)

create_rich_card(
    "coriander-powder-curry.jpg",
    "Authentic Culinary Harvest & Freshness",
    "Imparts fresh herbaceous aroma and cooling digestive wellness to daily meals",
    (210, 165, 85), (170, 120, 50), "food",
    "Stone Ground · Hand Cleaned · Traditional Indian Spice"
)

# 8. Farmstead Makhana 4th photo
create_rich_card(
    "farmstead-makhana-wetland.jpg",
    "Pristine Mithila Wetland Lotus Harvest",
    "Hand-harvested and slow-roasted on open fire for maximum crispness and protein",
    (235, 225, 210), (200, 185, 165), "seeds",
    "Zero Trans Fats · Naturally Gluten-Free · Rich in Calcium"
)

# 9. Sattu Powder 4th photo
create_rich_card(
    "sattu-powder-chana.jpg",
    "Wood-Fired Roasted Bengal Gram (Chana)",
    "Stone-ground to a fine, protein-dense flour that powers natural stamina",
    (210, 160, 85), (155, 105, 45), "mortar",
    "Traditional Desi Superfood · High Dietary Fiber · Gut Cooling"
)

# 10. MP Sharbati Wheat Flour 4th photo
create_rich_card(
    "mp-sharbati-wheat-flour-grain.jpg",
    "Golden Sehore Sharbati Whole Grains",
    "Slowly stone-ground with bran and wheat germ intact for fragrant, pillowy rotis",
    (215, 175, 110), (165, 125, 70), "seeds",
    "Zero Maida · High Dietary Fiber · Sweet Natural Aroma"
)

# 11. Quiet Morning Herbal Brew 4th photo
create_rich_card(
    "quiet-morning-brew-leaves.jpg",
    "Sacred Forest Tulsi & Cardamom Leaves",
    "Holistic triad of Krishna, Rama, and Vana Tulsi blended with green cardamom",
    (65, 105, 55), (115, 155, 85), "seeds",
    "Caffeine-Free · Respiratory Strength · Adaptogenic Calming"
)

# 12. Earthen Candle 3rd & 4th photos
create_rich_card(
    "earthen-candle-botanical.jpg",
    "Cedarwood & Vetiver Pure Essential Oils",
    "Infused with therapeutic forest botanicals for peaceful earthen sanctuary ambience",
    (145, 95, 60), (195, 145, 95), "lifestyle",
    "100% Clean Burning Soy Wax · Non-Toxic · Soothing Aromatherapy"
)

create_rich_card(
    "earthen-candle-artisan.jpg",
    "Artisan Handcrafted Terracotta Bowls",
    "Poured by traditional village potters using sacred sun-baked clay",
    (165, 105, 65), (205, 145, 95), "lifestyle",
    "Biodegradable Reusable Clay Vessel · Zero Plastic"
)

# 13. The Living Gift Box 3rd & 4th photos
create_rich_card(
    "the-living-gift-box-detail.jpg",
    "Festive Brass Diya & Sacred Jute Accents",
    "Hand-finished gift packaging celebrating timeless Indian cultural traditions",
    (195, 150, 75), (235, 195, 115), "lifestyle",
    "Artisanal Parchment Tag · Zero Plastic Eco-Luxury"
)

create_rich_card(
    "the-living-gift-box-lifestyle.jpg",
    "Curated Pure Harvest Celebration Set",
    "Featuring Gir Cow Ghee, Wildflower Honey, Lakadong Haldi & Terracotta Diyas",
    (215, 165, 85), (175, 125, 55), "food",
    "Heartfelt Conscious Gifting for Auspicious Moments"
)

# 14. Wood Ash Utensil Cleaner 2nd, 3rd & 4th photos
create_rich_card(
    "wood-ash-cleaner-action.jpg",
    "Natural Sparkling Shine for Brass & Copper",
    "Removes stubborn grease and tarnish effortlessly without harsh chemicals",
    (110, 110, 110), (160, 160, 155), "mortar",
    "Sacred Desi Cow Dung Ash · Lemon Peel Essential Oil"
)

create_rich_card(
    "wood-ash-cleaner-texture.jpg",
    "Ultra-Fine Sifted Cow Dung & Neem Powder",
    "Soft on hands, powerful on cookware, safe for soil and greywater runoff",
    (125, 125, 120), (170, 170, 165), "seeds",
    "100% Chemical-Free · Antiseptic Neem · Zero Synthetic Residue"
)

create_rich_card(
    "wood-ash-cleaner-back.jpg",
    "Zero Waste Biodegradable Guarantee",
    "Safe for greywater garden recycling · Ancient Vedic kitchen wisdom",
    (135, 135, 130), (180, 180, 175), "lifestyle",
    "Plastic-Free · 100% Compostable · River Safe"
)

# 15. Coconut Scrubber 2nd, 3rd & 4th photos
create_rich_card(
    "coconut-scrubber-close.jpg",
    "Dense Natural Coconut Coir Fiber Weave",
    "Interlocked fibers engineered for tough scrubbing without shedding microplastics",
    (135, 85, 45), (175, 120, 75), "seeds",
    "Non-Scratch on Cast Iron & Clay · Naturally Antibacterial"
)

create_rich_card(
    "coconut-scrubber-use.jpg",
    "Gentle & Durable Daily Cookware Cleaning",
    "Works seamlessly on brass, bronze, cast iron, ceramics, and stainless steel",
    (145, 95, 55), (185, 130, 85), "food",
    "Ergonomic Grip · Long-Lasting Durability · Microplastic Free"
)

create_rich_card(
    "coconut-scrubber-eco.jpg",
    "100% Home Compostable & Plastic-Free",
    "Returns safely to the soil at end of life, feeding garden earthworms and plants",
    (125, 80, 40), (165, 110, 65), "lifestyle",
    "Zero Chemical Binder · Plant-Based Jute Stitching"
)

# 16. Pashu Starter Pack 2nd, 3rd & 4th photos
create_rich_card(
    "pashu-starter-spray.jpg",
    "Herbal Antiseptic Livestock Wound Spray",
    "Crafted with pure neem oil, camphor, and turmeric for rapid healing and fly protection",
    (45, 95, 55), (85, 135, 85), "lifestyle",
    "Veterinary Formulated · Non-Toxic Organic Dairy Care"
)

create_rich_card(
    "pashu-starter-lick.jpg",
    "Pure Himalayan Rock Mineral Salt Block",
    "Rich in 84 natural trace minerals supporting milk yield and cow vitality",
    (195, 115, 90), (225, 155, 130), "seeds",
    "Natural Free-Choice Lick · Enhances Bovine Metabolism"
)

create_rich_card(
    "pashu-starter-balm.jpg",
    "Neem & Haldi Hoof & Udder Protective Balm",
    "Soothing emollient balm prevents cracks, bacterial infection, and weather stress",
    (185, 145, 55), (215, 175, 85), "mortar",
    "Zero Antibiotics · Pure Plant Extracts · Traditional Pashu Ayurveda"
)

print("\nAll 3-4 photo sets generated successfully!")
