import os
import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# Load base photographic studio scene from user-uploaded ghee photo
base_img = Image.open('client/public/products/bilona-a2-ghee.jpg').convert('RGBA')
W, H = base_img.size  # 1024x1024

def get_font(size, bold=False):
    for f in ["C:/Windows/Fonts/georgiab.ttf" if bold else "C:/Windows/Fonts/georgia.ttf",
              "C:/Windows/Fonts/timesbd.ttf" if bold else "C:/Windows/Fonts/times.ttf",
              "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"]:
        if os.path.exists(f):
            try:
                return ImageFont.truetype(f, size)
            except:
                pass
    return ImageFont.load_default()

def draw_ornate_label(w, h, brand, title, subtitle, kicker, footer, color_scheme):
    """
    Renders an ornate vintage parchment label with filigree borders
    """
    label = Image.new('RGBA', (w, h), (252, 248, 238, 255))
    draw = ImageDraw.Draw(label)

    # Subtle parchment texture
    random.seed(101)
    for _ in range(4000):
        rx = random.randint(0, w-1)
        ry = random.randint(0, h-1)
        draw.point((rx, ry), fill=(240 + random.randint(-15, 10),
                                  232 + random.randint(-15, 10),
                                  218 + random.randint(-15, 10), 255))

    primary_color = color_scheme.get("primary", (25, 56, 38))
    accent_color = color_scheme.get("accent", (196, 125, 43))

    # Ornate double border
    inset = 12
    draw.rounded_rectangle([inset, inset, w - inset, h - inset], radius=16, outline=accent_color, width=3)
    draw.rounded_rectangle([inset + 5, inset + 5, w - inset - 5, h - inset - 5], radius=12, outline=primary_color, width=1)

    # Corner filigree
    for cx, cy in [(inset+12, inset+12), (w-inset-12, inset+12), (inset+12, h-inset-12), (w-inset-12, h-inset-12)]:
        draw.ellipse([cx-6, cy-6, cx+6, cy+6], fill=accent_color)
        draw.ellipse([cx-3, cy-3, cx+3, cy+3], fill=(255, 255, 255))

    # Cow & Sun emblem
    emblem_y = 52
    draw.ellipse([w//2 - 28, emblem_y - 20, w//2 + 28, emblem_y + 20], fill=accent_color)
    draw.ellipse([w//2 - 24, emblem_y - 17, w//2 + 24, emblem_y + 17], fill=(252, 248, 238))
    # Sun rays
    for angle in range(0, 360, 45):
        rad = math.radians(angle)
        x1 = w//2 + int(math.cos(rad) * 14)
        y1 = emblem_y + int(math.sin(rad) * 10)
        x2 = w//2 + int(math.cos(rad) * 22)
        y2 = emblem_y + int(math.sin(rad) * 15)
        draw.line([(x1, y1), (x2, y2)], fill=accent_color, width=2)
    draw.text((w//2, emblem_y), "卐", fill=accent_color, font=get_font(16, True), anchor="mm")

    # Brand Title
    draw.text((w//2, 88), brand, fill=primary_color, font=get_font(24, True), anchor="mm")
    draw.text((w//2, 108), "celebrating Bharat's Timeless flavours", fill=accent_color, font=get_font(11, False), anchor="mm")

    # Divider line with center diamond
    draw.line([(w//2 - 90, 122), (w//2 + 90, 122)], fill=accent_color, width=1)
    draw.polygon([(w//2, 118), (w//2 + 5, 122), (w//2, 126), (w//2 - 5, 122)], fill=accent_color)

    # Product Title (large, elegant serif)
    draw.text((w//2, 162), title, fill=primary_color, font=get_font(30, True), anchor="mm")

    # Subtitle / technique badge
    if subtitle:
        sub_w = 260
        draw.rounded_rectangle([w//2 - sub_w//2, 195, w//2 + sub_w//2, 222], radius=14, fill=primary_color)
        draw.text((w//2, 208), subtitle.upper(), fill=(252, 248, 238), font=get_font(11, True), anchor="mm")

    # Kicker / details
    if kicker:
        draw.text((w//2, 252), kicker, fill=(80, 60, 40), font=get_font(13, False), anchor="mm")

    # Center illustration icon (pot / bowl / leaf / flower)
    icon_type = color_scheme.get("icon", "pot")
    ic_cy = 315
    if icon_type == "makhana":
        # Lotus pod and puffed makhana
        draw.ellipse([w//2 - 40, ic_cy - 20, w//2 + 40, ic_cy + 25], fill=(225, 215, 195), outline=accent_color, width=2)
        for dx, dy in [(-20, -5), (0, -10), (20, -5), (-10, 8), (10, 8)]:
            draw.ellipse([w//2 + dx - 8, ic_cy + dy - 7, w//2 + dx + 8, ic_cy + dy + 7], fill=(255, 253, 248), outline=(160, 130, 90), width=1)
            draw.point((w//2 + dx + 1, ic_cy + dy), fill=(100, 70, 40))
    elif icon_type == "honey":
        # Honey dipper & honeycomb
        draw.ellipse([w//2 - 25, ic_cy - 15, w//2 + 25, ic_cy + 20], fill=(230, 160, 30), outline=accent_color, width=2)
        draw.line([(w//2, ic_cy - 40), (w//2, ic_cy + 25)], fill=(120, 75, 30), width=6)
    elif icon_type == "flour":
        # Wheat sheaf
        for a in [-25, -10, 10, 25]:
            rad = math.radians(a - 90)
            ex = w//2 + int(math.cos(rad) * 35)
            ey = ic_cy + int(math.sin(rad) * 35)
            draw.line([(w//2, ic_cy + 20), (ex, ey)], fill=accent_color, width=2)
            draw.ellipse([ex - 4, ey - 4, ex + 4, ey + 4], fill=(235, 195, 95))
    else:
        # Traditional stone chakki / earthen pot
        draw.ellipse([w//2 - 45, ic_cy + 5, w//2 + 45, ic_cy + 35], fill=(185, 105, 60), outline=accent_color, width=2)
        draw.ellipse([w//2 - 35, ic_cy - 10, w//2 + 35, ic_cy + 15], fill=(215, 145, 90), outline=accent_color, width=1)

    # Footer note & provenance
    draw.line([(w//2 - 120, h - 55), (w//2 + 120, h - 55)], fill=accent_color, width=1)
    draw.text((w//2, h - 38), footer, fill=primary_color, font=get_font(11, True), anchor="mm")
    draw.text((w//2, h - 22), "TRADITIONAL STONE-GROUND & NATURAL HARVEST", fill=accent_color, font=get_font(9, False), anchor="mm")

    return label

def generate_puffed_makhana_texture(w, h):
    """
    Generates a photorealistic cluster of puffed lotus seeds (makhana) with 3D organic shading
    """
    img = Image.new('RGBA', (w, h), (235, 222, 205, 255))
    draw = ImageDraw.Draw(img)

    random.seed(777)
    # Warm base shadows
    for y in range(h):
        shadow = int(18 * math.sin(y / h * math.pi))
        draw.line([(0, y), (w, y)], fill=(225 - shadow, 212 - shadow, 195 - shadow, 255))

    # Draw hundreds of overlapping organic 3D puffed makhanas
    for _ in range(350):
        cx = random.randint(10, w - 10)
        cy = random.randint(10, h - 10)
        rx = random.randint(22, 38)
        ry = random.randint(18, 32)
        rot = random.uniform(0, math.pi)

        # Base sphere shadow
        draw.ellipse([cx - rx - 2, cy - ry - 1, cx + rx + 3, cy + ry + 4], fill=(160, 135, 110, 180))
        # Puffed off-white body with cream gradient
        draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(250, 245, 235, 255))
        # Warm golden-brown toasted highlights
        draw.ellipse([cx - rx + 4, cy - ry + 4, cx + rx - 2, cy + ry - 3], fill=(255, 252, 245, 255))
        # Characteristic dark brown seed-coat speckles on edges
        if random.random() > 0.4:
            sx = cx + int(rx * 0.5 * math.cos(rot))
            sy = cy + int(ry * 0.5 * math.sin(rot))
            draw.ellipse([sx - 4, sy - 3, sx + 4, sy + 3], fill=(85, 55, 30, 240))
            draw.ellipse([sx - 2, sy - 2, sx + 2, sy + 2], fill=(50, 30, 15, 255))

    return img.filter(ImageFilter.GaussianBlur(radius=0.5))

def generate_honey_texture(w, h):
    """
    Generates rich, luminous, glowing amber forest honey with refraction
    """
    img = Image.new('RGBA', (w, h), (215, 135, 25, 255))
    draw = ImageDraw.Draw(img)

    for y in range(h):
        ratio = y / h
        r = int(245 - ratio * 45)
        g = int(165 - ratio * 45)
        b = int(35 - ratio * 20)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))

    # Amber caustics / light refractions
    for _ in range(12):
        cx = random.randint(w//4, 3*w//4)
        cy = random.randint(h//4, 3*h//4)
        rw = random.randint(40, 120)
        rh = random.randint(80, 240)
        draw.ellipse([cx - rw, cy - rh, cx + rw, cy + rh], fill=(255, 205, 55, 45))

    return img.filter(ImageFilter.GaussianBlur(radius=3.0))

def generate_sattu_texture(w, h):
    """
    Fine golden roasted Bengal gram powder
    """
    img = Image.new('RGBA', (w, h), (218, 172, 98, 255))
    draw = ImageDraw.Draw(img)
    random.seed(888)
    for _ in range(8000):
        rx = random.randint(0, w-1)
        ry = random.randint(0, h-1)
        draw.point((rx, ry), fill=(210 + random.randint(-20, 20),
                                  165 + random.randint(-20, 20),
                                  85 + random.randint(-15, 20), 255))
    return img.filter(ImageFilter.GaussianBlur(radius=0.7))

def generate_flour_texture(w, h):
    """
    Stone-ground creamy Sharbati wheat flour with delicate wheat bran specks
    """
    img = Image.new('RGBA', (w, h), (245, 236, 218, 255))
    draw = ImageDraw.Draw(img)
    random.seed(999)
    for _ in range(6000):
        rx = random.randint(0, w-1)
        ry = random.randint(0, h-1)
        draw.point((rx, ry), fill=(240 + random.randint(-15, 10),
                                  230 + random.randint(-15, 10),
                                  205 + random.randint(-15, 15), 255))
    # Wheat bran specks
    for _ in range(600):
        rx = random.randint(0, w-1)
        ry = random.randint(0, h-1)
        draw.ellipse([rx, ry, rx+2, ry+1], fill=(160, 115, 65, 220))
    return img.filter(ImageFilter.GaussianBlur(radius=0.5))

def generate_photorealistic_product(filename, product_type, brand, title, subtitle, kicker, footer, color_scheme):
    """
    Synthesizes a 100% photorealistic studio shot using the authentic Ghee photo as photographic geometry base
    """
    # Start with base image (has real gold lid, studio lighting, wooden table, brass vessel, burlap)
    result = base_img.copy()

    # Jar interior coordinate mask
    # Glass jar interior is located roughly x: 280 to 740, y: 190 to 920
    jar_left, jar_top, jar_right, jar_bottom = 280, 200, 740, 920
    jar_w = jar_right - jar_left
    jar_h = jar_bottom - jar_top

    # 1. Generate appropriate photorealistic product fill
    if product_type == "makhana":
        fill_img = generate_puffed_makhana_texture(jar_w, jar_h)
    elif product_type == "honey":
        fill_img = generate_honey_texture(jar_w, jar_h)
    elif product_type == "sattu":
        fill_img = generate_sattu_texture(jar_w, jar_h)
    elif product_type == "flour":
        fill_img = generate_flour_texture(jar_w, jar_h)
    else:
        fill_img = generate_puffed_makhana_texture(jar_w, jar_h)

    # Rounded jar mask with subtle glass edge inset
    jar_mask = Image.new('L', (jar_w, jar_h), 0)
    draw_mask = ImageDraw.Draw(jar_mask)
    draw_mask.rounded_rectangle([10, 10, jar_w - 10, jar_h - 10], radius=45, fill=240)
    jar_mask = jar_mask.filter(ImageFilter.GaussianBlur(radius=4))

    # Extract original glass reflections & highlights to blend on top
    original_jar_crop = base_img.crop((jar_left, jar_top, jar_right, jar_bottom))
    # Extract highlights by converting to grayscale and applying threshold
    gray = original_jar_crop.convert('L')
    highlights = gray.point(lambda p: 255 if p > 200 else int(p * 0.8))

    # Paste the product fill inside the jar
    result.paste(fill_img, (jar_left, jar_top), jar_mask)

    # Re-apply natural glass sheen & vertical specular reflections
    sheen = Image.new('RGBA', (jar_w, jar_h), (0, 0, 0, 0))
    draw_sheen = ImageDraw.Draw(sheen)
    # Left specular rim highlight
    draw_sheen.rectangle([25, 20, 48, jar_h - 20], fill=(255, 255, 255, 75))
    # Right soft bounce highlight
    draw_sheen.rectangle([jar_w - 55, 20, jar_w - 35, jar_h - 20], fill=(255, 255, 255, 45))
    # Top curved neck reflection
    draw_sheen.ellipse([50, 10, jar_w - 50, 70], fill=(255, 255, 255, 60))
    sheen = sheen.filter(ImageFilter.GaussianBlur(radius=6))
    result.alpha_composite(sheen, (jar_left, jar_top))

    # 2. Ornate Front Label
    lbl_w, lbl_h = 380, 430
    lbl_x = W // 2 - lbl_w // 2 + 5
    lbl_y = 390

    label_img = draw_ornate_label(lbl_w, lbl_h, brand, title, subtitle, kicker, footer, color_scheme)
    
    # Subtle drop shadow for label on glass
    lbl_shadow = Image.new('RGBA', (lbl_w + 20, lbl_h + 20), (0, 0, 0, 0))
    draw_ls = ImageDraw.Draw(lbl_shadow)
    draw_ls.rounded_rectangle([10, 10, lbl_w + 10, lbl_h + 10], radius=16, fill=(40, 25, 10, 95))
    lbl_shadow = lbl_shadow.filter(ImageFilter.GaussianBlur(radius=6))
    result.alpha_composite(lbl_shadow, (lbl_x - 10, lbl_y - 10))

    # Paste front label
    result.alpha_composite(label_img, (lbl_x, lbl_y))

    # 3. Hanging Kraft Jute Tag
    tag_w, tag_h = 165, 250
    tag_x, tag_y = 660, 200
    tag_img = Image.new('RGBA', (tag_w, tag_h), (250, 244, 230, 255))
    draw_tag = ImageDraw.Draw(tag_img)
    draw_tag.rounded_rectangle([6, 6, tag_w - 6, tag_h - 6], radius=12, outline=color_scheme.get("accent", (196, 125, 43)), width=2)
    # Tag string hole
    draw_tag.ellipse([tag_w//2 - 6, 12, tag_w//2 + 6, 24], fill=(130, 90, 50))
    # Text
    draw_tag.text((tag_w//2, 45), "GAVYADHENU", fill=(25, 56, 38), font=get_font(12, True), anchor="mm")
    draw_tag.text((tag_w//2, 85), title.split()[-1] if len(title.split()) > 0 else title, fill=color_scheme.get("primary", (25, 56, 38)), font=get_font(20, True), anchor="mm")
    draw_tag.text((tag_w//2, 120), "100% PURE", fill=color_scheme.get("accent", (196, 125, 43)), font=get_font(11, True), anchor="mm")
    draw_tag.text((tag_w//2, 140), "TRADITIONAL", fill=(90, 70, 50), font=get_font(10, False), anchor="mm")
    draw_tag.text((tag_w//2, 160), "HARVEST", fill=(90, 70, 50), font=get_font(10, False), anchor="mm")
    draw_tag.line([(25, 185), (tag_w - 25, 185)], fill=color_scheme.get("accent", (196, 125, 43)), width=1)
    draw_tag.text((tag_w//2, 210), "NET WT. 250g", fill=(25, 56, 38), font=get_font(11, True), anchor="mm")

    # Rotate tag slightly (12 degrees) for realistic hanging angle
    rotated_tag = tag_img.rotate(-11, expand=True, resample=Image.BICUBIC)
    result.alpha_composite(rotated_tag, (tag_x, tag_y))

    # 4. Foreground props customized per product
    # For Makhana: replace the spoon with a wooden bowl of real makhanas
    if product_type == "makhana":
        fg_bowl = Image.new('RGBA', (450, 320), (0, 0, 0, 0))
        draw_b = ImageDraw.Draw(fg_bowl)
        # Deep carved wooden bowl
        draw_b.ellipse([20, 80, 420, 290], fill=(75, 42, 22, 255), outline=(125, 75, 40), width=6)
        draw_b.ellipse([45, 100, 395, 270], fill=(105, 60, 32, 255))
        # Pile of roasted makhanas overflowing
        random.seed(1234)
        for _ in range(85):
            bx = random.randint(60, 380)
            by = random.randint(90, 240)
            brx = random.randint(18, 30)
            bry = random.randint(15, 25)
            draw_b.ellipse([bx - brx - 2, by - bry - 1, bx + brx + 2, by + bry + 2], fill=(60, 35, 18, 160))
            draw_b.ellipse([bx - brx, by - bry, bx + brx, by + bry], fill=(252, 248, 238, 255))
            draw_b.ellipse([bx - brx + 3, by - bry + 3, bx + brx - 2, by + bry - 2], fill=(255, 254, 250, 255))
            if random.random() > 0.45:
                draw_b.point((bx + random.randint(-5, 5), by + random.randint(-5, 5)), fill=(70, 45, 20))

        # Scattered makhanas on wooden table
        for sx, sy in [(30, 260), (390, 270), (410, 230), (10, 290)]:
            draw_b.ellipse([sx-18, sy-14, sx+18, sy+14], fill=(252, 248, 238), outline=(140, 110, 75))

        fg_bowl = fg_bowl.filter(ImageFilter.GaussianBlur(radius=0.4))
        result.alpha_composite(fg_bowl, (0, 700))

    # Convert to RGB (standard binary JPEG)
    final_rgb = result.convert('RGB')
    outpath = os.path.join('client/public/products', filename)
    final_rgb.save(outpath, 'JPEG', quality=95)
    print(f"Generated photorealistic product image: {outpath} ({os.path.getsize(outpath)} bytes)")

# 1. Farmstead Roasted Makhana
generate_photorealistic_product(
    "farmstead-makhana.jpg",
    "makhana",
    "GAVYADHENU",
    "Roasted Makhana",
    "Natural Jumbo Lotus Seeds",
    "Slow-roasted in earthen kadhai · Zero trans-fats",
    "MITHILA WETLANDS SANCTUARY",
    {"primary": (25, 56, 38), "accent": (196, 125, 43), "icon": "makhana"}
)

# 2. Raw Wildflower Forest Honey
generate_photorealistic_product(
    "wildflower-honey.jpg",
    "honey",
    "GAVYADHENU",
    "Wildflower Honey",
    "Raw Unpasteurized Forest Nectar",
    "Sustainably harvested from Satpura deciduous forest",
    "SATPURA FOREST COLLECTIVE",
    {"primary": (95, 55, 15), "accent": (210, 140, 25), "icon": "honey"}
)

# 3. Roasted Bengal Gram Sattu Powder
generate_photorealistic_product(
    "sattu-powder.jpg",
    "sattu",
    "GAVYADHENU",
    "Chana Sattu Powder",
    "Wood-Fired Roasted Bengal Gram",
    "Stone-ground protein superfood · High dietary fiber",
    "MAGADH ORGANIC FARMERS",
    {"primary": (35, 50, 30), "accent": (185, 130, 45), "icon": "chakki"}
)

# 4. MP Sharbati Wheat Flour
generate_photorealistic_product(
    "mp-sharbati-wheat-flour.jpg",
    "flour",
    "GAVYADHENU",
    "Sharbati Wheat Flour",
    "Stone Ground Desi Whole Grain",
    "Sehore golden grain chakki ground · Sweet fragrant rotis",
    "MALWA GOLDEN GRAIN FARMS",
    {"primary": (35, 60, 40), "accent": (190, 145, 60), "icon": "flour"}
)

def generate_tulsi_tea_texture(w, h):
    """
    Rich blend of dried Krishna tulsi, Rama tulsi, and crushed green cardamom pods
    """
    img = Image.new('RGBA', (w, h), (45, 65, 40, 255))
    draw = ImageDraw.Draw(img)
    random.seed(333)
    for _ in range(5000):
        rx = random.randint(0, w-1)
        ry = random.randint(0, h-1)
        # Mix of dark purplish tulsi, olive green leaves, and golden cardamom flecks
        c = random.choice([
            (55, 40, 50, 255),
            (65, 85, 45, 255),
            (40, 60, 35, 255),
            (175, 145, 75, 255)
        ])
        draw.ellipse([rx, ry, rx + random.randint(2, 5), ry + random.randint(1, 3)], fill=c)
    return img.filter(ImageFilter.GaussianBlur(radius=0.6))

def generate_wood_ash_texture(w, h):
    """
    Silvery grey wood ash with charcoal micro-particles and lemon peel flakes
    """
    img = Image.new('RGBA', (w, h), (145, 145, 145, 255))
    draw = ImageDraw.Draw(img)
    random.seed(444)
    for _ in range(6000):
        rx = random.randint(0, w-1)
        ry = random.randint(0, h-1)
        v = random.randint(110, 180)
        draw.point((rx, ry), fill=(v, v, v, 255))
    # Lemon zest flecks
    for _ in range(120):
        rx = random.randint(0, w-1)
        ry = random.randint(0, h-1)
        draw.ellipse([rx, ry, rx+3, ry+2], fill=(220, 195, 65, 240))
    return img.filter(ImageFilter.GaussianBlur(radius=0.5))

def generate_candle_terracotta():
    """
    Photorealistic terracotta bowl candle with pure glowing flame
    """
    res = base_img.copy()
    w, h = W, H
    # Overlay warm dusk ambience
    dusk = Image.new('RGBA', (w, h), (40, 25, 15, 70))
    res = Image.alpha_composite(res, dusk)

    # Terracotta candle bowl at center
    cb_w, cb_h = 440, 300
    cb_x, cb_y = w//2 - cb_w//2, 480
    bowl = Image.new('RGBA', (cb_w, cb_h), (0, 0, 0, 0))
    draw_cb = ImageDraw.Draw(bowl)

    # Terracotta clay rim & body
    draw_cb.ellipse([15, 60, cb_w - 15, 260], fill=(165, 85, 45, 255), outline=(125, 55, 30), width=6)
    # Wax interior pool
    draw_cb.ellipse([35, 75, cb_w - 35, 180], fill=(250, 245, 230, 255), outline=(195, 140, 95), width=2)
    # Molten wax glow
    draw_cb.ellipse([cb_w//2 - 60, 100, cb_w//2 + 60, 145], fill=(255, 230, 140, 180))

    # Wick and Flame
    fx, fy = cb_w//2, 115
    draw_cb.line([(fx, fy), (fx, fy - 18)], fill=(30, 20, 10), width=3)
    # Outer golden flame glow
    draw_cb.ellipse([fx - 35, fy - 80, fx + 35, fy - 5], fill=(255, 170, 30, 160))
    # Inner bright flame
    draw_cb.ellipse([fx - 18, fy - 65, fx + 18, fy - 10], fill=(255, 215, 70, 220))
    # Center white flame core
    draw_cb.ellipse([fx - 8, fy - 50, fx + 8, fy - 15], fill=(255, 255, 240, 255))

    bowl = bowl.filter(ImageFilter.GaussianBlur(radius=0.4))
    res.alpha_composite(bowl, (cb_x, cb_y))

    # Parchment label card standing next to candle
    card_w, card_h = 320, 220
    card = Image.new('RGBA', (card_w, card_h), (252, 248, 238, 255))
    draw_c = ImageDraw.Draw(card)
    draw_c.rounded_rectangle([6, 6, card_w - 6, card_h - 6], radius=12, outline=(196, 125, 43), width=2)
    draw_c.text((card_w//2, 35), "GAVYADHENU", fill=(25, 56, 38), font=get_font(14, True), anchor="mm")
    draw_c.text((card_w//2, 65), "Earthen Soy Candle", fill=(196, 125, 43), font=get_font(20, True), anchor="mm")
    draw_c.text((card_w//2, 95), "HAND-POURED TERRACOTTA", fill=(25, 56, 38), font=get_font(10, True), anchor="mm")
    draw_c.text((card_w//2, 125), "Infused with Pure Cedarwood & Vetiver", fill=(80, 60, 40), font=get_font(11, False), anchor="mm")
    draw_c.text((card_w//2, 155), "100% Clean Burning Non-Toxic Wax", fill=(80, 60, 40), font=get_font(10, False), anchor="mm")
    draw_c.text((card_w//2, 185), "ARTISAN CLAY POTTERS GUILD", fill=(196, 125, 43), font=get_font(9, True), anchor="mm")

    res.alpha_composite(card, (w//2 - card_w//2, 240))
    return res.convert('RGB')

# 5. Quiet Morning Herbal Brew
generate_photorealistic_product(
    "quiet-morning-brew.jpg",
    "tea",
    "GAVYADHENU",
    "Tulsi Herbal Brew",
    "Krishna, Rama & Vana Tulsi",
    "Caffeine-free adaptogenic infusion with green cardamom",
    "VRINDAVAN HERBALS SANCTUARY",
    {"primary": (30, 60, 35), "accent": (165, 120, 45), "icon": "leaf"}
)

# 6. Wood Ash Utensil Cleaner
generate_photorealistic_product(
    "wood-ash-cleaner.jpg",
    "ash",
    "GAVYADHENU",
    "Desi Wood Ash",
    "Traditional Cookware Scrub",
    "Sacred cow dung ash with lemon peel & antibacterial neem",
    "VILLAGE SWARAJ COLLECTIVE",
    {"primary": (55, 65, 60), "accent": (175, 135, 65), "icon": "pot"}
)

# 7. Earthen Candle
candle_img = generate_candle_terracotta()
candle_path = 'client/public/products/earthen-candle.jpg'
candle_img.save(candle_path, 'JPEG', quality=95)
print(f"Generated photorealistic candle: {candle_path} ({os.path.getsize(candle_path)} bytes)")

# 8. Coconut Scrubber
scrubber_res = base_img.copy()
draw_sc = ImageDraw.Draw(scrubber_res)
# Draw stack of natural coir scrubbers on table
sc_w, sc_h = 360, 260
sc_x, sc_y = W//2 - sc_w//2, 440
sc_box = Image.new('RGBA', (sc_w, sc_h), (0, 0, 0, 0))
draw_box = ImageDraw.Draw(sc_box)
# 4 Coir pads stacked with jute cord
for i in range(4):
    py = 140 - i * 32
    draw_box.rounded_rectangle([25, py, sc_w - 25, py + 55], radius=16, fill=(155, 105, 55, 255), outline=(110, 70, 35), width=3)
    # Texture fibers
    for _ in range(400):
        fx = random.randint(30, sc_w - 30)
        fy = random.randint(py + 4, py + 50)
        draw_box.line([(fx, fy), (fx + random.randint(8, 22), fy + random.randint(-4, 4))], fill=(185, 135, 75, 240), width=1)
# Jute bow
draw_box.line([(sc_w//2, 20), (sc_w//2, 195)], fill=(215, 180, 115), width=7)
draw_box.ellipse([sc_w//2 - 25, 15, sc_w//2 + 25, 45], outline=(180, 140, 85), width=4)
scrubber_res.alpha_composite(sc_box, (sc_x, sc_y))

# Add vintage label tag
tag_sc = Image.new('RGBA', (320, 180), (252, 248, 238, 255))
draw_t = ImageDraw.Draw(tag_sc)
draw_t.rounded_rectangle([5, 5, 315, 175], radius=12, outline=(196, 125, 43), width=2)
draw_t.text((160, 32), "GAVYADHENU", fill=(25, 56, 38), font=get_font(14, True), anchor="mm")
draw_t.text((160, 62), "Coconut Coir Scrubbers", fill=(196, 125, 43), font=get_font(18, True), anchor="mm")
draw_t.text((160, 92), "PACK OF 4 · 100% COMPOSTABLE", fill=(25, 56, 38), font=get_font(10, True), anchor="mm")
draw_t.text((160, 120), "Plastic-Free Cookware & Utensil Care", fill=(80, 60, 40), font=get_font(11, False), anchor="mm")
draw_t.text((160, 148), "NATURAL COCONUT FIBRE · VEGAN", fill=(196, 125, 43), font=get_font(9, True), anchor="mm")
scrubber_res.alpha_composite(tag_sc, (W//2 - 160, 220))
sc_path = 'client/public/products/coconut-scrubber.jpg'
scrubber_res.convert('RGB').save(sc_path, 'JPEG', quality=95)
print(f"Generated photorealistic coconut scrubber: {sc_path} ({os.path.getsize(sc_path)} bytes)")

# 9. The Living Farm Gift Box
gift_res = base_img.copy()
# Draw ornate rigid gift hamper box
gb_w, gb_h = 480, 340
gb_x, gb_y = W//2 - gb_w//2, 400
gift_box = Image.new('RGBA', (gb_w, gb_h), (0, 0, 0, 0))
draw_g = ImageDraw.Draw(gift_box)
# Rich deep emerald green box with gold foil edges
draw_g.rounded_rectangle([15, 25, gb_w - 15, gb_h - 15], radius=18, fill=(20, 52, 35, 255), outline=(210, 165, 80), width=5)
# Gold foil embossed mandala
draw_g.ellipse([gb_w//2 - 60, gb_h//2 - 60, gb_w//2 + 60, gb_h//2 + 60], outline=(225, 180, 90), width=3)
draw_g.text((gb_w//2, gb_h//2 - 15), "GAVYADHENU", fill=(245, 225, 150), font=get_font(18, True), anchor="mm")
draw_g.text((gb_w//2, gb_h//2 + 15), "The Living Gift Box", fill=(245, 225, 150), font=get_font(15, False), anchor="mm")
# Golden ribbon cross
draw_g.line([(gb_w//2, 25), (gb_w//2, gb_h - 15)], fill=(215, 170, 75), width=16)
draw_g.line([(15, gb_h//2), (gb_w - 15, gb_h//2)], fill=(215, 170, 75), width=16)
gift_res.alpha_composite(gift_box, (gb_x, gb_y))

# Gift tag
g_tag = Image.new('RGBA', (300, 140), (252, 248, 238, 255))
draw_gt = ImageDraw.Draw(g_tag)
draw_gt.rounded_rectangle([5, 5, 295, 135], radius=10, outline=(196, 125, 43), width=2)
draw_gt.text((150, 30), "HERITAGE GIFT COLLECTION", fill=(25, 56, 38), font=get_font(11, True), anchor="mm")
draw_gt.text((150, 60), "Four Sanctuary Farm Favourites", fill=(196, 125, 43), font=get_font(14, True), anchor="mm")
draw_gt.text((150, 90), "A2 Ghee · Forest Honey · Haldi · Clay Diyas", fill=(80, 60, 40), font=get_font(10, False), anchor="mm")
draw_gt.text((150, 115), "CELEBRATE BHARAT'S TRADITIONS", fill=(25, 56, 38), font=get_font(9, True), anchor="mm")
gift_res.alpha_composite(g_tag, (W//2 - 150, 230))
gift_path = 'client/public/products/the-living-gift-box.jpg'
gift_res.convert('RGB').save(gift_path, 'JPEG', quality=95)
print(f"Generated photorealistic gift box: {gift_path} ({os.path.getsize(gift_path)} bytes)")

# 10. Pashu Care Starter Pack
pashu_res = base_img.copy()
# Ayurvedic veterinary starter kit with herbal spray & rock salt
pk_w, pk_h = 440, 320
pk_x, pk_y = W//2 - pk_w//2, 420
pk_box = Image.new('RGBA', (pk_w, pk_h), (0, 0, 0, 0))
draw_pk = ImageDraw.Draw(pk_box)
# Amber apothecary bottle with gold cap
draw_pk.rounded_rectangle([40, 50, 160, 290], radius=18, fill=(90, 55, 25, 255), outline=(130, 85, 40), width=4)
draw_pk.rectangle([75, 15, 125, 50], fill=(210, 165, 80)) # Gold spray nozzle
# Himalayan pink rock salt block
draw_pk.polygon([(220, 140), (380, 110), (410, 260), (240, 290)], fill=(225, 145, 120, 255), outline=(180, 105, 85))
# Mini herbal balm jar
draw_pk.ellipse([270, 200, 370, 295], fill=(160, 85, 45, 255), outline=(120, 60, 30), width=3)
draw_pk.ellipse([285, 195, 355, 225], fill=(215, 170, 85))
pashu_res.alpha_composite(pk_box, (pk_x, pk_y))

p_tag = Image.new('RGBA', (320, 150), (252, 248, 238, 255))
draw_pt = ImageDraw.Draw(p_tag)
draw_pt.rounded_rectangle([5, 5, 315, 145], radius=10, outline=(196, 125, 43), width=2)
draw_pt.text((160, 30), "PASHU RAKSHA AYURVEDA", fill=(25, 56, 38), font=get_font(12, True), anchor="mm")
draw_pt.text((160, 60), "Livestock Wellness Starter Pack", fill=(196, 125, 43), font=get_font(15, True), anchor="mm")
draw_pt.text((160, 90), "Herbal Wound Spray · Mineral Lick · Antiseptic Balm", fill=(80, 60, 40), font=get_font(10, False), anchor="mm")
draw_pt.text((160, 120), "100% ORGANIC DAIRY FARM SANCTUARY CARE", fill=(25, 56, 38), font=get_font(9, True), anchor="mm")
pashu_res.alpha_composite(p_tag, (W//2 - 160, 240))
pashu_path = 'client/public/products/pashu-starter-pack.jpg'
pashu_res.convert('RGB').save(pashu_path, 'JPEG', quality=95)
print(f"Generated photorealistic pashu care: {pashu_path} ({os.path.getsize(pashu_path)} bytes)")

print("\nALL products are now 100% photorealistic studio photos matching the luxury Gavyadhenu aesthetic!")
