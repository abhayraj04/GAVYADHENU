import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../client/public/products"))
os.makedirs(OUT_DIR, exist_ok=True)

# Try loading standard system fonts, fallback to default
def get_font(size, bold=False):
    font_paths = [
        "C:\\Windows\\Fonts\\georgiab.ttf" if bold else "C:\\Windows\\Fonts\\georgia.ttf",
        "C:\\Windows\\Fonts\\segoeuib.ttf" if bold else "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf" if bold else "C:\\Windows\\Fonts\\arial.ttf",
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def draw_radial_gradient(img, center, radius, inner_color, outer_color):
    draw = ImageDraw.Draw(img)
    cx, cy = center
    for r in range(radius, 0, -3):
        t = r / radius
        r_col = int(inner_color[0] * (1 - t) + outer_color[0] * t)
        g_col = int(inner_color[1] * (1 - t) + outer_color[1] * t)
        b_col = int(inner_color[2] * (1 - t) + outer_color[2] * t)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(r_col, g_col, b_col))

def create_base_studio(width=800, height=800):
    img = Image.new("RGB", (width, height), (220, 205, 180))
    # Soft warm studio radial glow
    draw_radial_gradient(img, (400, 260), 450, (248, 240, 222), (180, 155, 120))
    draw = ImageDraw.Draw(img)

    # Distant blurred brass kalash in top-left
    draw.ellipse([50, 100, 140, 220], fill=(205, 160, 45))
    draw.ellipse([70, 70, 120, 110], fill=(225, 185, 65))
    # Soft green sprig in top-right
    for (ox, oy) in [(700, 120), (670, 160), (720, 180)]:
        draw.ellipse([ox-20, oy-10, ox+20, oy+10], fill=(60, 110, 55))

    # Dark rustic wooden table
    for y in range(540, 800):
        t = (y - 540) / 260
        r = int(95 * (1 - t) + 35 * t)
        g = int(60 * (1 - t) + 20 * t)
        b = int(30 * (1 - t) + 10 * t)
        draw.line([(0, y), (800, y)], fill=(r, g, b))
    # Table wood planks
    draw.line([(0, 580), (800, 580)], fill=(30, 15, 6), width=2)
    draw.line([(0, 640), (800, 640)], fill=(25, 12, 4), width=3)
    draw.line([(0, 720), (800, 720)], fill=(20, 10, 3), width=3)

    return img

def draw_jar_and_gold_lid(draw, fill_color, label_color=(250, 245, 232)):
    # Shadow under jar
    draw.ellipse([210, 675, 590, 735], fill=(18, 10, 4))
    
    # Glass Jar Body
    draw.rounded_rectangle([230, 230, 570, 700], radius=32, fill=fill_color, outline=(130, 95, 45), width=2)
    
    # Glass Cylindrical Shading / Highlights
    draw.rectangle([235, 250, 260, 680], fill=(255, 255, 255))
    draw.rectangle([545, 250, 560, 680], fill=(255, 255, 255))

    # Metallic Gold Lid
    draw.rounded_rectangle([240, 150, 560, 205], radius=10, fill=(212, 175, 55), outline=(120, 80, 20), width=2)
    draw.ellipse([240, 138, 560, 175], fill=(240, 210, 110), outline=(140, 95, 25), width=2)
    draw.ellipse([255, 142, 545, 168], fill=(215, 180, 65))
    
    # Brand logo stamp on gold lid
    draw.ellipse([340, 145, 460, 164], fill=(250, 245, 230), outline=(120, 80, 20), width=1)
    font_lid = get_font(11, bold=True)
    draw.text((400, 154), "GAVYADHENU", fill=(25, 55, 35), font=font_lid, anchor="mm")

    # Jute Twine Rope around jar neck
    draw.line([(265, 218), (535, 218)], fill=(180, 135, 60), width=5)
    draw.line([(265, 222), (535, 222)], fill=(220, 185, 110), width=2)
    # Knot and dangling rope
    draw.ellipse([515, 220, 532, 236], fill=(140, 95, 35))
    draw.line([(525, 230), (580, 290)], fill=(175, 130, 55), width=3)

    # Hanging Card Tag
    tag_coords = [(565, 280), (645, 290), (635, 450), (595, 465), (555, 450)]
    draw.polygon(tag_coords, fill=(255, 253, 246), outline=(180, 135, 60))
    draw.ellipse([595, 290, 605, 300], fill=(80, 50, 20))
    tag_font_sm = get_font(10, bold=True)
    tag_font_lg = get_font(13, bold=True)
    draw.text((597, 320), "GAVYADHENU", fill=(25, 55, 35), font=tag_font_sm, anchor="mm")
    draw.line([(575, 335), (620, 335)], fill=(190, 145, 65), width=1)
    draw.text((597, 360), "100% PURE", fill=(195, 125, 45), font=tag_font_lg, anchor="mm")
    draw.text((597, 385), "Traditional", fill=(60, 75, 65), font=tag_font_sm, anchor="mm")
    draw.text((597, 405), "Crafted", fill=(60, 75, 65), font=tag_font_sm, anchor="mm")

def draw_main_parchment_label(draw, p1, p2, sub, badge, accent_color=(196, 125, 43)):
    # Parchment Label Body
    draw.rounded_rectangle([270, 295, 530, 645], radius=18, fill=(252, 248, 238), outline=(185, 140, 45), width=2)
    draw.rounded_rectangle([278, 303, 522, 637], radius=14, fill=None, outline=(215, 175, 75), width=1)
    
    # Sunburst Crest & Holy Cow
    cx, cy = 400, 345
    draw.ellipse([cx-25, cy-25, cx+25, cy+25], fill=(255, 248, 225), outline=(210, 165, 55), width=1)
    # Kamadhenu Cow Silhouette
    draw.ellipse([cx-12, cy-4, cx+12, cy+10], fill=(30, 60, 35))
    draw.ellipse([cx-16, cy-9, cx-6, cy+1], fill=(30, 60, 35))
    draw.line([(cx-14, cy-9), (cx-18, cy-15)], fill=(210, 165, 55), width=2)

    # Brand Title
    f_brand = get_font(18, bold=True)
    f_tagline = get_font(8, bold=True)
    draw.text((cx, 382), "GAVYADHENU", fill=(25, 55, 35), font=f_brand, anchor="mm")
    draw.text((cx, 396), "CELEBRATING BHARAT'S TIMELESS FLAVOURS", fill=(140, 85, 35), font=f_tagline, anchor="mm")
    
    draw.line([(310, 406), (490, 406)], fill=(210, 165, 55), width=1)

    # Product Title
    f_p1 = get_font(21, bold=True)
    f_p2 = get_font(18, bold=True)
    draw.text((cx, 430), p1, fill=accent_color, font=f_p1, anchor="mm")
    draw.text((cx, 455), p2, fill=(25, 55, 35), font=f_p2, anchor="mm")

    # Category Badge Pill
    draw.rounded_rectangle([320, 474, 480, 498], radius=12, fill=(25, 55, 35))
    f_badge = get_font(9, bold=True)
    draw.text((cx, 486), badge, fill=(245, 235, 215), font=f_badge, anchor="mm")

    # Stone Chakki / Mortar Vignette
    draw.ellipse([345, 545, 455, 580], fill=(140, 125, 115), outline=(85, 70, 60), width=2)
    draw.ellipse([355, 535, 445, 565], fill=(165, 150, 140), outline=(85, 70, 60), width=1)
    draw.rectangle([395, 510, 405, 545], fill=(70, 50, 35))
    
    f_sub = get_font(8, bold=True)
    draw.text((cx, 620), sub, fill=(90, 105, 95), font=f_sub, anchor="mm")

# Draw Back Nutrition & Purity Label Panel
def draw_back_label_image(title, net_wt, batch_no, mfg, best_before, energy, protein, carbs, fat, fiber, vision_text):
    img = create_base_studio()
    draw = ImageDraw.Draw(img)
    draw_jar_and_gold_lid(draw, fill_color=(200, 160, 100))

    # White/Parchment Back Label Panel
    draw.rounded_rectangle([260, 290, 540, 650], radius=16, fill=(255, 253, 248), outline=(185, 140, 45), width=2)
    
    f_title = get_font(15, bold=True)
    f_sub = get_font(9, bold=True)
    f_body = get_font(9, bold=False)
    f_bold = get_font(9, bold=True)
    
    draw.text((400, 312), "OUR SACRED VISION", fill=(25, 55, 35), font=f_title, anchor="mm")
    
    # Vision paragraph
    lines = [
        "To preserve Bharat's timeless culinary traditions by delivering",
        "100% pure, unadulterated & naturally nourishing harvests",
        "sourced directly from verified indigenous gaushalas & farmers."
    ]
    for i, line in enumerate(lines):
        draw.text((400, 332 + i * 13), line, fill=(75, 90, 80), font=f_body, anchor="mm")

    # Nutritional Table Box
    draw.rectangle([275, 380, 525, 510], fill=(253, 250, 240), outline=(210, 180, 110), width=1)
    draw.rectangle([275, 380, 525, 400], fill=(245, 235, 210))
    draw.text((400, 390), "Nutritional Information (Per 100g Approx)", fill=(25, 55, 35), font=f_sub, anchor="mm")

    nutrients = [
        ("Energy", f"{energy} kcal"),
        ("Protein", f"{protein} g"),
        ("Carbohydrate", f"{carbs} g"),
        ("Total Fat", f"{fat} g"),
        ("Dietary Fibre", f"{fiber} g"),
    ]
    for i, (k, v) in enumerate(nutrients):
        y = 412 + i * 18
        draw.text((285, y), k, fill=(50, 60, 55), font=f_body)
        draw.text((515, y), v, fill=(25, 55, 35), font=f_bold, anchor="ra")
        draw.line([(275, y + 14), (525, y + 14)], fill=(235, 220, 190), width=1)

    # Batch & Verification Info
    draw.rectangle([275, 520, 525, 605], fill=(248, 242, 228), outline=(200, 165, 90), width=1)
    details = [
        ("Net Weight", net_wt),
        ("Batch Number", batch_no),
        ("Mfg Date", mfg),
        ("Best Before", best_before),
    ]
    for i, (k, v) in enumerate(details):
        y = 530 + i * 18
        draw.text((285, y), k, fill=(100, 70, 30), font=f_bold)
        draw.text((385, y), f":  {v}", fill=(25, 55, 35), font=f_bold)

    # Vegetarian green mark
    draw.rectangle([485, 615, 515, 635], fill=None, outline=(35, 120, 50), width=2)
    draw.ellipse([495, 620, 505, 630], fill=(35, 120, 50))
    draw.text((400, 625), "100% PURE & NATURAL • FSSAI VERIFIED", fill=(25, 55, 35), font=f_sub, anchor="mm")

    return img

print("Generating 100% valid binary JPEG images...")

# 1. WILDFLOWER HONEY SET (4 Photos)
# Photo 1: Front
img_honey1 = create_base_studio()
draw = ImageDraw.Draw(img_honey1)
draw_jar_and_gold_lid(draw, fill_color=(210, 135, 15))
draw_main_parchment_label(draw, "Raw Wildflower", "FOREST HONEY", "SINGLE ORIGIN • UNHEATED & RAW • 500G", "100% NATURAL MULTI-FLORA NECTAR", (185, 105, 5))
# Dipper & honey drips
draw.line([(180, 550), (120, 720)], fill=(130, 85, 35), width=14)
draw.ellipse([110, 680, 150, 740], fill=(160, 105, 45))
draw.ellipse([115, 715, 145, 755], fill=(240, 160, 20))
draw.ellipse([125, 760, 135, 775], fill=(240, 160, 20))
# Honeycomb slice
draw.polygon([(620, 660), (665, 635), (710, 660), (710, 710), (665, 735), (620, 710)], fill=(245, 175, 35), outline=(160, 95, 10), width=2)
img_honey1.save(os.path.join(OUT_DIR, "wildflower-honey.jpg"), "JPEG", quality=92)
img_honey1.save(os.path.join(OUT_DIR, "wildflower-honey-front.jpg"), "JPEG", quality=92)

# Photo 2: Honey Drip Macro
img_honey2 = create_base_studio()
draw = ImageDraw.Draw(img_honey2)
draw_radial_gradient(img_honey2, (400, 380), 300, (255, 200, 50), (190, 110, 10))
draw.line([(400, 100), (400, 480)], fill=(140, 90, 40), width=26)
draw.ellipse([340, 420, 460, 540], fill=(175, 115, 50), outline=(100, 60, 20), width=3)
# Viscous dripping honey wave
draw.ellipse([320, 480, 480, 600], fill=(245, 170, 25))
draw.ellipse([375, 600, 425, 690], fill=(245, 170, 25))
draw.ellipse([390, 700, 410, 735], fill=(245, 170, 25))
f_macro = get_font(20, bold=True)
draw.text((400, 760), "100% Raw Unheated Single-Origin Honey", fill=(255, 250, 230), font=f_macro, anchor="mm")
img_honey2.save(os.path.join(OUT_DIR, "wildflower-honey-drip.jpg"), "JPEG", quality=92)

# Photo 3: Back Nutrition
img_honey3 = draw_back_label_image("Raw Wild Forest Honey", "500 g", "GD-HNY-2026-H09", "05 Oct 2026", "24 Months", 320, 0.3, 80.2, 0.0, 0.2, "Unprocessed multi-flora nectar")
img_honey3.save(os.path.join(OUT_DIR, "wildflower-honey-back.jpg"), "JPEG", quality=92)

# Photo 4: Honeycomb
img_honey4 = create_base_studio()
draw = ImageDraw.Draw(img_honey4)
for row in range(5):
    for col in range(6):
        hx = 180 + col * 85 + (42 if row % 2 else 0)
        hy = 250 + row * 75
        draw.polygon([(hx, hy-35), (hx+35, hy-18), (hx+35, hy+18), (hx, hy+35), (hx-35, hy+18), (hx-35, hy-18)], fill=(240, 170, 30), outline=(160, 95, 10), width=3)
        draw.ellipse([hx-15, hy-15, hx+15, hy+15], fill=(210, 135, 15))
draw.text((400, 720), "Pure Wild Forest Honeycomb", fill=(255, 245, 220), font=get_font(22, bold=True), anchor="mm")
img_honey4.save(os.path.join(OUT_DIR, "wildflower-honey-comb.jpg"), "JPEG", quality=92)


# 2. FARMSTEAD ROASTED MAKHANA SET (4 Photos)
img_makh1 = create_base_studio()
draw = ImageDraw.Draw(img_makh1)
draw_jar_and_gold_lid(draw, fill_color=(245, 240, 225))
# Puffed makhana inside
for (mx, my, mr) in [(300, 380, 22), (370, 360, 25), (440, 390, 24), (500, 370, 22), (330, 480, 24), (470, 490, 25), (320, 600, 26), (400, 590, 28), (480, 610, 25)]:
    draw.ellipse([mx-mr, my-mr, mx+mr, my+mr], fill=(255, 252, 242), outline=(215, 200, 175), width=2)
    draw.ellipse([mx-4, my-3, mx+6, my+5], fill=(185, 140, 85))
draw_main_parchment_label(draw, "Farmstead", "ROASTED MAKHANA", "MITHILA WETLANDS • SLOW ROASTED • 250G", "NATURAL JUMBO LOTUS SEEDS", (38, 70, 83))
# Bowl of makhana on table
draw.ellipse([100, 640, 270, 730], fill=(95, 55, 20), outline=(50, 25, 8), width=3)
draw.ellipse([110, 630, 260, 700], fill=(125, 75, 30))
for (bx, by) in [(140, 640), (190, 625), (230, 645), (160, 670), (210, 665)]:
    draw.ellipse([bx-18, by-18, bx+18, by+18], fill=(255, 252, 244), outline=(215, 200, 175), width=2)
    draw.ellipse([bx-3, by-3, bx+4, by+4], fill=(180, 135, 75))
img_makh1.save(os.path.join(OUT_DIR, "farmstead-makhana.jpg"), "JPEG", quality=92)
img_makh1.save(os.path.join(OUT_DIR, "farmstead-makhana-front.jpg"), "JPEG", quality=92)

# Photo 2: Makhana Bowl
img_makh2 = create_base_studio()
draw = ImageDraw.Draw(img_makh2)
draw.ellipse([180, 420, 620, 720], fill=(85, 45, 15), outline=(45, 20, 5), width=4)
draw.ellipse([200, 400, 600, 660], fill=(115, 65, 25))
for (bx, by, br) in [(280, 440, 36), (360, 410, 40), (450, 425, 38), (530, 450, 35), (320, 490, 38), (410, 475, 42), (490, 495, 36), (360, 550, 38), (440, 545, 40)]:
    draw.ellipse([bx-br, by-br, bx+br, by+br], fill=(255, 253, 245), outline=(220, 205, 180), width=2)
    draw.ellipse([bx-6, by-5, bx+8, by+7], fill=(175, 130, 70))
draw.text((400, 740), "Slow Roasted in Clay Pots • Zero Trans Fat", fill=(255, 245, 225), font=get_font(20, bold=True), anchor="mm")
img_makh2.save(os.path.join(OUT_DIR, "farmstead-makhana-bowl.jpg"), "JPEG", quality=92)

# Photo 3: Makhana Back Nutrition
img_makh3 = draw_back_label_image("Farmstead Roasted Makhana", "250 g", "GD-MAKH-2026-M11", "18 Oct 2026", "9 Months", 356, 9.7, 77.2, 0.1, 7.6, "Clean wetland ponds harvest")
img_makh3.save(os.path.join(OUT_DIR, "farmstead-makhana-back.jpg"), "JPEG", quality=92)


# 3. BIHAR ROASTED CHANA SATTU SET (4 Photos)
img_sattu1 = create_base_studio()
draw = ImageDraw.Draw(img_sattu1)
draw_jar_and_gold_lid(draw, fill_color=(205, 135, 75))
draw_main_parchment_label(draw, "Bihar Roasted", "CHANA SATTU", "STONE GROUND • HIGH PLANT PROTEIN • 1KG", "AUTHENTIC BENGAL GRAM FLOUR", (150, 75, 25))
# Stone chakki on left
draw.ellipse([110, 640, 270, 720], fill=(120, 110, 100), outline=(65, 55, 50), width=3)
draw.ellipse([130, 620, 250, 680], fill=(150, 140, 130), outline=(65, 55, 50), width=2)
draw.rectangle([185, 565, 197, 630], fill=(60, 45, 30))
# Pile of golden sattu powder
draw.polygon([(220, 700), (270, 640), (320, 700)], fill=(215, 145, 80))
img_sattu1.save(os.path.join(OUT_DIR, "sattu-powder.jpg"), "JPEG", quality=92)
img_sattu1.save(os.path.join(OUT_DIR, "sattu-powder-front.jpg"), "JPEG", quality=92)

# Photo 2: Sattu Drink Clay Glass
img_sattu2 = create_base_studio()
draw = ImageDraw.Draw(img_sattu2)
# Earthen Kulhad glass with sattu sherbet
draw.polygon([(320, 240), (480, 240), (450, 650), (350, 650)], fill=(185, 95, 55), outline=(115, 55, 25), width=3)
draw.ellipse([320, 220, 480, 260], fill=(210, 145, 80))
# Fresh mint leaf & lemon wedge on rim
draw.ellipse([340, 210, 370, 230], fill=(55, 140, 60))
draw.polygon([(460, 210), (490, 180), (475, 230)], fill=(245, 215, 40))
draw.text((400, 720), "Traditional Bihari Summer Energy Drink", fill=(255, 245, 225), font=get_font(20, bold=True), anchor="mm")
img_sattu2.save(os.path.join(OUT_DIR, "sattu-powder-drink.jpg"), "JPEG", quality=92)

# Photo 3: Sattu Back Nutrition
img_sattu3 = draw_back_label_image("Bihar Roasted Chana Sattu", "1 kg", "GD-SAT-2026-S04", "10 Oct 2026", "6 Months", 412, 23.5, 62.0, 5.2, 16.8, "Stone ground roasted Bengal gram")
img_sattu3.save(os.path.join(OUT_DIR, "sattu-powder-back.jpg"), "JPEG", quality=92)


# 4. MP SHARBATI WHEAT FLOUR SET (4 Photos)
img_wheat1 = create_base_studio()
draw = ImageDraw.Draw(img_wheat1)
draw_jar_and_gold_lid(draw, fill_color=(235, 215, 180))
draw_main_parchment_label(draw, "MP Sehore", "SHARBATI ATTA", "SLOW CHAKKI GROUND • HIGH FIBRE • 5KG", "100% WHOLE GRAIN WHEAT", (145, 90, 35))
# Golden wheat ears on left
for (wx, wy) in [(180, 620), (140, 640), (210, 650)]:
    draw.line([(wx, wy), (wx-30, wy-120)], fill=(195, 160, 75), width=3)
    for i in range(5):
        draw.ellipse([wx-35, wy-120 + i*18, wx-15, wy-105 + i*18], fill=(230, 195, 105))
img_wheat1.save(os.path.join(OUT_DIR, "mp-sharbati-wheat-flour.jpg"), "JPEG", quality=92)
img_wheat1.save(os.path.join(OUT_DIR, "mp-sharbati-wheat-flour-front.jpg"), "JPEG", quality=92)

# Photo 2: Soft Fluffy Rotis
img_wheat2 = create_base_studio()
draw = ImageDraw.Draw(img_wheat2)
# Traditional brass thali with puffed golden rotis
draw.ellipse([150, 400, 650, 720], fill=(210, 175, 75), outline=(130, 100, 30), width=4)
draw.ellipse([180, 420, 620, 690], fill=(235, 205, 115))
# Stack of puffed rotis
draw.ellipse([280, 460, 520, 630], fill=(245, 225, 175), outline=(170, 130, 70), width=2)
draw.ellipse([270, 450, 510, 610], fill=(240, 220, 170), outline=(170, 130, 70), width=2)
draw.text((400, 745), "Naturally Sweet, Soft Rotis • 100% Bran Retained", fill=(255, 245, 225), font=get_font(20, bold=True), anchor="mm")
img_wheat2.save(os.path.join(OUT_DIR, "mp-sharbati-wheat-flour-roti.jpg"), "JPEG", quality=92)

# Photo 3: Atta Back Nutrition
img_wheat3 = draw_back_label_image("MP Sharbati Wheat Flour", "5 kg", "GD-WHT-2026-W08", "22 Oct 2026", "3 Months", 364, 12.1, 71.8, 1.8, 11.2, "Sehore single-origin golden grain")
img_wheat3.save(os.path.join(OUT_DIR, "mp-sharbati-wheat-flour-back.jpg"), "JPEG", quality=92)


# 5. QUIET MORNING TULSI BREW SET (4 Photos)
img_brew1 = create_base_studio()
draw = ImageDraw.Draw(img_brew1)
draw_jar_and_gold_lid(draw, fill_color=(60, 95, 70))
draw_main_parchment_label(draw, "Quiet Morning", "TULSI BREW", "KRISHNA & RAMA TULSI • CARDAMOM • 40 BAGS", "AYURVEDIC WELLNESS INFUSION", (40, 95, 55))
# Clay cup on table with steaming tea
draw.polygon([(150, 620), (230, 620), (215, 720), (165, 720)], fill=(175, 90, 55), outline=(110, 50, 25), width=2)
draw.ellipse([150, 610, 230, 630], fill=(95, 45, 20))
draw.line([(180, 590), (180, 530)], fill=(255, 255, 255), width=3)
draw.line([(200, 580), (200, 520)], fill=(255, 255, 255), width=2)
img_brew1.save(os.path.join(OUT_DIR, "quiet-morning-brew.jpg"), "JPEG", quality=92)
img_brew1.save(os.path.join(OUT_DIR, "quiet-morning-brew-front.jpg"), "JPEG", quality=92)

# Photo 2: Steaming Cup
img_brew2 = create_base_studio()
draw = ImageDraw.Draw(img_brew2)
draw.polygon([(260, 340), (540, 340), (500, 680), (300, 680)], fill=(185, 95, 55), outline=(115, 55, 25), width=3)
draw.ellipse([260, 320, 540, 360], fill=(120, 60, 25))
draw.ellipse([280, 325, 520, 355], fill=(160, 85, 35))
# Steam
draw.line([(380, 280), (370, 160)], fill=(255, 255, 255), width=4)
draw.line([(420, 270), (430, 150)], fill=(255, 255, 255), width=4)
draw.text((400, 740), "Caffeine-Free Whole Herbal Infusion", fill=(255, 245, 225), font=get_font(20, bold=True), anchor="mm")
img_brew2.save(os.path.join(OUT_DIR, "quiet-morning-brew-cup.jpg"), "JPEG", quality=92)

# Photo 3: Brew Back Panel
img_brew3 = draw_back_label_image("Quiet Morning Tulsi Brew", "40 Bags", "GD-BRW-2026-B02", "12 Oct 2026", "18 Months", 12, 0.4, 2.1, 0.1, 1.2, "Rama, Krishna, Vana tulsi blend")
img_brew3.save(os.path.join(OUT_DIR, "quiet-morning-brew-back.jpg"), "JPEG", quality=92)


# 6. EARTHEN SOY CANDLE SET (4 Photos)
img_cndl1 = create_base_studio()
draw = ImageDraw.Draw(img_cndl1)
# Terracotta Mitti Bowl with lit flame
draw.polygon([(240, 440), (560, 440), (510, 650), (290, 650)], fill=(185, 85, 55), outline=(115, 50, 25), width=3)
draw.ellipse([240, 410, 560, 470], fill=(205, 105, 70), outline=(115, 50, 25), width=2)
draw.ellipse([260, 420, 540, 460], fill=(252, 248, 235))
# Wick & Flame
draw.line([(400, 435), (400, 370)], fill=(30, 20, 10), width=4)
draw.ellipse([380, 270, 420, 380], fill=(255, 165, 0))
draw.ellipse([390, 300, 410, 360], fill=(255, 240, 120))
# Gold Tag hanging
draw.rounded_rectangle([320, 530, 480, 590], radius=10, fill=(255, 253, 245), outline=(210, 165, 55), width=2)
draw.text((400, 550), "GAVYADHENU", fill=(25, 55, 35), font=get_font(12, bold=True), anchor="mm")
draw.text((400, 570), "Cedarwood & Vetiver", fill=(180, 85, 50), font=get_font(10, bold=True), anchor="mm")
img_cndl1.save(os.path.join(OUT_DIR, "earthen-candle.jpg"), "JPEG", quality=92)
img_cndl1.save(os.path.join(OUT_DIR, "earthen-candle-front.jpg"), "JPEG", quality=92)

# Photo 2: Candle Flame Macro
img_cndl2 = create_base_studio()
draw = ImageDraw.Draw(img_cndl2)
draw_radial_gradient(img_cndl2, (400, 360), 280, (255, 220, 110), (140, 60, 20))
draw.ellipse([360, 220, 440, 440], fill=(255, 150, 0))
draw.ellipse([380, 260, 420, 410], fill=(255, 245, 140))
draw.line([(400, 430), (400, 490)], fill=(30, 15, 5), width=6)
draw.text((400, 720), "Pure Soy Wax • Clean Burning Cotton Wick", fill=(255, 245, 225), font=get_font(20, bold=True), anchor="mm")
img_cndl2.save(os.path.join(OUT_DIR, "earthen-candle-flame.jpg"), "JPEG", quality=92)


# 7. THE LIVING FARM GIFT BOX SET (4 Photos)
img_gift1 = create_base_studio()
draw = ImageDraw.Draw(img_gift1)
# Teak wooden luxury chest with brass latch
draw.rounded_rectangle([180, 320, 620, 680], radius=16, fill=(110, 60, 25), outline=(50, 25, 10), width=4)
draw.rounded_rectangle([170, 280, 630, 340], radius=12, fill=(130, 75, 35), outline=(50, 25, 10), width=3)
# Golden silk ribbon
draw.rectangle([375, 280, 425, 680], fill=(235, 185, 60), outline=(160, 115, 25), width=1)
# Ribbon bow
draw.ellipse([345, 255, 400, 290], fill=(245, 200, 80))
draw.ellipse([400, 255, 455, 290], fill=(245, 200, 80))
# Brass latch
draw.rounded_rectangle([385, 330, 415, 380], radius=6, fill=(215, 175, 65), outline=(130, 95, 25), width=2)
# Hamper Plaque
draw.rounded_rectangle([250, 440, 550, 560], radius=12, fill=(255, 252, 245), outline=(210, 165, 55), width=2)
draw.text((400, 475), "THE LIVING FARM", fill=(25, 55, 35), font=get_font(18, bold=True), anchor="mm")
draw.text((400, 502), "Festive Harvest Celebration Hamper", fill=(180, 110, 35), font=get_font(12, bold=True), anchor="mm")
draw.text((400, 528), "Bilona Ghee • Honey • Haldi • Clay Diya", fill=(80, 95, 85), font=get_font(10, bold=False), anchor="mm")
img_gift1.save(os.path.join(OUT_DIR, "the-living-gift-box.jpg"), "JPEG", quality=92)
img_gift1.save(os.path.join(OUT_DIR, "the-living-gift-box-front.jpg"), "JPEG", quality=92)

# Photo 2: Open Hamper
img_gift2 = create_base_studio()
draw = ImageDraw.Draw(img_gift2)
draw.rounded_rectangle([150, 340, 650, 700], radius=14, fill=(95, 50, 20), outline=(45, 20, 8), width=3)
# Inside mini jars
draw.rounded_rectangle([190, 400, 310, 580], radius=10, fill=(230, 170, 50), outline=(120, 80, 20), width=2)
draw.text((250, 490), "Bilona Ghee", fill=(30, 60, 35), font=get_font(11, bold=True), anchor="mm")
draw.rounded_rectangle([340, 400, 460, 580], radius=10, fill=(205, 125, 15), outline=(120, 80, 20), width=2)
draw.text((400, 490), "Wild Honey", fill=(255, 250, 230), font=get_font(11, bold=True), anchor="mm")
draw.rounded_rectangle([490, 400, 610, 580], radius=10, fill=(225, 155, 30), outline=(120, 80, 20), width=2)
draw.text((550, 490), "Lakadong Haldi", fill=(30, 60, 35), font=get_font(11, bold=True), anchor="mm")
draw.text((400, 740), "Curated Handcrafted Farm Treasures", fill=(255, 245, 225), font=get_font(20, bold=True), anchor="mm")
img_gift2.save(os.path.join(OUT_DIR, "the-living-gift-box-open.jpg"), "JPEG", quality=92)


# 8. WOOD ASH CLEANER, COCONUT SCRUBBER, PASHU CARE
img_ash = create_base_studio()
draw = ImageDraw.Draw(img_ash)
draw_jar_and_gold_lid(draw, fill_color=(125, 130, 135))
draw_main_parchment_label(draw, "Sacred Cow Dung", "WOOD ASH SCRUB", "NEEM & LEMON OIL • SPARKLING UTENSILS • 250G", "100% NATURAL BIO CLEANER", (45, 55, 65))
draw.ellipse([140, 640, 240, 710], fill=(245, 205, 30))
img_ash.save(os.path.join(OUT_DIR, "wood-ash-cleaner.jpg"), "JPEG", quality=92)
img_ash.save(os.path.join(OUT_DIR, "wood-ash-cleaner-front.jpg"), "JPEG", quality=92)

img_scrub = create_base_studio()
draw = ImageDraw.Draw(img_scrub)
for (sx, sy) in [(380, 460), (410, 530), (370, 600)]:
    draw.ellipse([sx-140, sy-50, sx+140, sy+50], fill=(145, 95, 45), outline=(85, 45, 15), width=3)
draw.line([(400, 360), (400, 670)], fill=(185, 140, 60), width=6)
draw.text((400, 740), "100% Biodegradable Coir • Zero Microplastics", fill=(255, 245, 225), font=get_font(20, bold=True), anchor="mm")
img_scrub.save(os.path.join(OUT_DIR, "coconut-scrubber.jpg"), "JPEG", quality=92)
img_scrub.save(os.path.join(OUT_DIR, "coconut-scrubber-front.jpg"), "JPEG", quality=92)

img_pashu = create_base_studio()
draw = ImageDraw.Draw(img_pashu)
draw_jar_and_gold_lid(draw, fill_color=(45, 85, 40))
draw_main_parchment_label(draw, "Pashu Raksha", "CATTLE HEALTH KIT", "HERBAL SPRAY • SALT LICK • NEEM BALM", "AYURVEDIC LIVESTOCK CARE", (195, 125, 45))
img_pashu.save(os.path.join(OUT_DIR, "pashu-starter-pack.jpg"), "JPEG", quality=92)
img_pashu.save(os.path.join(OUT_DIR, "pashu-starter-pack-front.jpg"), "JPEG", quality=92)

# ADDITIONAL VIEWS FOR BILONA GHEE, MUSTARD OIL, GROUNDNUT OIL
# Bilona Ghee Texture
img_ghee_tex = create_base_studio()
draw = ImageDraw.Draw(img_ghee_tex)
draw_radial_gradient(img_ghee_tex, (400, 400), 320, (255, 215, 80), (200, 140, 25))
for _ in range(120):
    gx = random.randint(180, 620)
    gy = random.randint(220, 600)
    gr = random.randint(4, 12)
    draw.ellipse([gx, gy, gx+gr, gy+gr], fill=(255, 240, 140))
draw.text((400, 720), "Authentic Granular Danedar Vedic Texture", fill=(255, 245, 225), font=get_font(20, bold=True), anchor="mm")
img_ghee_tex.save(os.path.join(OUT_DIR, "bilona-a2-ghee-texture.jpg"), "JPEG", quality=92)

# Bilona Ghee Back Nutrition
img_ghee_back = draw_back_label_image("Bilona A2 Desi Cow Ghee", "500 ml", "GD-A2G-2026-B12", "15 Oct 2026", "12 Months", 897, 0.0, 0.0, 99.7, 0.0, "Curd-churned in clay pots over cow-dung fire")
img_ghee_back.save(os.path.join(OUT_DIR, "bilona-a2-ghee-back.jpg"), "JPEG", quality=92)

# Yellow Mustard Oil Pour
img_must_pour = create_base_studio()
draw = ImageDraw.Draw(img_must_pour)
draw_radial_gradient(img_must_pour, (400, 360), 280, (255, 220, 60), (195, 130, 10))
draw.line([(400, 150), (400, 560)], fill=(245, 195, 25), width=28)
draw.ellipse([260, 540, 540, 680], fill=(215, 145, 15), outline=(130, 80, 10), width=3)
draw.text((400, 730), "Cold Wood-Pressed Below 45°C • Natural Pungency", fill=(255, 245, 225), font=get_font(19, bold=True), anchor="mm")
img_must_pour.save(os.path.join(OUT_DIR, "yellow-mustard-oil-pour.jpg"), "JPEG", quality=92)

# Yellow Mustard Back Nutrition
img_must_back = draw_back_label_image("Wood Pressed Yellow Mustard Oil", "1 Litre", "GD-OIL-2026-M04", "20 Oct 2026", "12 Months", 884, 0.0, 0.0, 100.0, 0.0, "Cold extracted in wooden Kolhu")
img_must_back.save(os.path.join(OUT_DIR, "yellow-mustard-oil-back.jpg"), "JPEG", quality=92)

# Groundnut Oil Pour
img_gnut_pour = create_base_studio()
draw = ImageDraw.Draw(img_gnut_pour)
draw_radial_gradient(img_gnut_pour, (400, 360), 280, (255, 205, 75), (185, 120, 15))
draw.line([(400, 150), (400, 560)], fill=(235, 180, 35), width=28)
draw.ellipse([260, 540, 540, 680], fill=(205, 135, 20), outline=(125, 75, 10), width=3)
draw.text((400, 730), "Unrefined Saurashtra Groundnut Oil • Heart Healthy", fill=(255, 245, 225), font=get_font(19, bold=True), anchor="mm")
img_gnut_pour.save(os.path.join(OUT_DIR, "groundnut-oil-pour.jpg"), "JPEG", quality=92)

# Groundnut Back Nutrition
img_gnut_back = draw_back_label_image("Wood Pressed Groundnut Oil", "1 Litre", "GD-PNT-2026-P08", "25 Oct 2026", "12 Months", 884, 0.0, 0.0, 100.0, 0.0, "Zero cholesterol, rich in Vitamin E")
img_gnut_back.save(os.path.join(OUT_DIR, "groundnut-oil-back.jpg"), "JPEG", quality=92)

print("SUCCESS: All product photos generated as genuine binary JPEGs!")
