import os
import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

base_img = Image.open('client/public/products/bilona-a2-ghee.jpg').convert('RGBA')
W, H = base_img.size  # 1024x1024

def get_font(size, bold=False, italic=False):
    fonts_to_try = []
    if bold and italic:
        fonts_to_try = ["C:/Windows/Fonts/georgiaz.ttf", "C:/Windows/Fonts/timesbi.ttf"]
    elif bold:
        fonts_to_try = ["C:/Windows/Fonts/georgiab.ttf", "C:/Windows/Fonts/timesbd.ttf", "C:/Windows/Fonts/arialbd.ttf"]
    elif italic:
        fonts_to_try = ["C:/Windows/Fonts/georgiai.ttf", "C:/Windows/Fonts/timesi.ttf"]
    else:
        fonts_to_try = ["C:/Windows/Fonts/georgia.ttf", "C:/Windows/Fonts/times.ttf", "C:/Windows/Fonts/arial.ttf"]
    
    for f in fonts_to_try:
        if os.path.exists(f):
            try:
                return ImageFont.truetype(f, size)
            except:
                pass
    return ImageFont.load_default()

def draw_mughal_arch_label(cfg):
    """
    Renders an authentic, 3-column Mughal arch parchment label
    matching the user's provided ghee photo exactly.
    """
    lw, lh = 540, 560
    label = Image.new('RGBA', (lw, lh), (0, 0, 0, 0))
    draw = ImageDraw.Draw(label)

    # Aged parchment background color
    parchment_color = (252, 247, 236, 255)
    border_gold = (196, 142, 60, 255)
    deep_green = (22, 54, 34, 255)
    dark_brown = (65, 45, 30, 255)
    gold_fill = (225, 175, 80, 255)

    # Draw Mughal arched parchment shape
    # Bottom rectangle: y from 90 to lh - 10
    # Top arch: apex at y=15, curves down to (10, 90) and (lw-10, 90)
    arch_points = []
    # Left edge
    arch_points.append((15, lh - 15))
    arch_points.append((15, 90))
    # Curve to apex
    for x in range(15, lw//2):
        t = (x - 15) / (lw//2 - 15)
        # S-curve pointed arch
        y = int(90 - (1 - math.cos(t * math.pi * 0.5)) * 75)
        arch_points.append((x, y))
    arch_points.append((lw//2, 12)) # apex
    for x in range(lw//2, lw - 14):
        t = (x - lw//2) / (lw//2 - 15)
        y = int(12 + (1 - math.cos((1 - t) * math.pi * 0.5)) * 75)
        arch_points.append((x, y))
    arch_points.append((lw - 15, 90))
    arch_points.append((lw - 15, lh - 15))

    # Fill parchment body
    draw.polygon(arch_points, fill=parchment_color)

    # Add realistic paper grain
    random.seed(999)
    for _ in range(8000):
        rx = random.randint(16, lw - 16)
        ry = random.randint(30, lh - 16)
        if label.getpixel((rx, ry))[3] > 0:
            c = random.randint(-12, 10)
            draw.point((rx, ry), fill=(245 + c, 238 + c, 222 + c, 255))

    # Outer and inner gold borders
    draw.polygon(arch_points, outline=border_gold)
    # Inner border inset by 6px
    inner_points = [(p[0] + (6 if p[0] < lw//2 else (-6 if p[0] > lw//2 else 0)),
                     p[1] + (6 if p[1] < lh//2 else -6)) for p in arch_points]
    draw.polygon(inner_points, outline=deep_green)

    # Ornate green filigree border panels on left and right
    draw.rectangle([18, 90, 36, lh - 18], fill=deep_green)
    draw.rectangle([lw - 36, 90, lw - 18, lh - 18], fill=deep_green)
    # Gold floral vine inside green panel
    for vy in range(100, lh - 30, 24):
        draw.ellipse([23, vy, 31, vy + 12], fill=border_gold)
        draw.ellipse([lw - 31, vy, lw - 23, vy + 12], fill=border_gold)

    # -------------------------------------------------------------
    # 1. LEFT COLUMN: Benefits & Techniques (x: 42 to 165)
    # -------------------------------------------------------------
    col1_cx = 104
    draw.text((col1_cx, 105), cfg.get("col1_title", "THE POWER OF MAKHANA"), fill=deep_green, font=get_font(9, True), anchor="mm")
    
    # Kicker summary
    draw.text((col1_cx, 130), cfg.get("col1_sub", "A rare pristine wetland\nsuperfood, rich in\ncalcium and natural protein."), fill=dark_brown, font=get_font(7, False), anchor="mm", align="center")

    # 5 Circular Benefit Badges
    benefits = cfg.get("benefits", [
        ("High Protein", "Builds natural stamina"),
        ("Zero Trans Fats", "Heart friendly"),
        ("Light Digestion", "Gentle on gut"),
        ("Rich in Calcium", "Strengthens bones"),
        ("100% Natural", "No chemical additives")
    ])
    
    badge_y = 168
    for icon_name, desc in benefits:
        # Gold ring with dark green circle
        draw.ellipse([col1_cx - 45, badge_y - 8, col1_cx - 27, badge_y + 10], fill=deep_green, outline=border_gold, width=1)
        draw.text((col1_cx - 36, badge_y + 1), "✓", fill=(255, 235, 170), font=get_font(8, True), anchor="mm")
        # Text label
        draw.text((col1_cx - 20, badge_y - 4), icon_name, fill=deep_green, font=get_font(8, True))
        draw.text((col1_cx - 20, badge_y + 6), desc, fill=dark_brown, font=get_font(6, False))
        badge_y += 28

    # Ancient technique box at bottom of col 1
    draw.rounded_rectangle([42, 330, 166, 420], radius=8, outline=border_gold, width=1)
    draw.text((col1_cx, 342), "ANCIENT ROASTING", fill=deep_green, font=get_font(7, True), anchor="mm")
    draw.text((col1_cx, 353), "TECHNIQUE", fill=deep_green, font=get_font(7, True), anchor="mm")
    draw.text((col1_cx, 380), "Slow fire-roasted in\nclay kadhai to retain\ncrunch and vital\nlow-GI nutrients.", fill=dark_brown, font=get_font(7, False), anchor="mm", align="center")

    # -------------------------------------------------------------
    # 2. CENTER COLUMN: Brand & Sacred Arch (x: 175 to 365)
    # -------------------------------------------------------------
    center_cx = lw // 2

    # Sacred Cow & Sunburst Emblem
    sun_y = 65
    draw.ellipse([center_cx - 28, sun_y - 20, center_cx + 28, sun_y + 20], fill=border_gold)
    draw.ellipse([center_cx - 25, sun_y - 17, center_cx + 25, sun_y + 17], fill=parchment_color)
    # Radiating golden rays
    for angle in range(0, 360, 30):
        rad = math.radians(angle)
        x1 = center_cx + int(math.cos(rad) * 16)
        y1 = sun_y + int(math.sin(rad) * 12)
        x2 = center_cx + int(math.cos(rad) * 26)
        y2 = sun_y + int(math.sin(rad) * 18)
        draw.line([(x1, y1), (x2, y2)], fill=border_gold, width=1)
    draw.text((center_cx, sun_y), "卐", fill=border_gold, font=get_font(18, True), anchor="mm")

    # Brand Title
    draw.text((center_cx, 98), "GAVYADHENU", fill=deep_green, font=get_font(23, True), anchor="mm")
    draw.text((center_cx, 116), "celebrating Bharat's Timeless flavours", fill=border_gold, font=get_font(9, italic=True), anchor="mm")

    # Ornate divider with center diamond
    draw.line([(center_cx - 75, 128), (center_cx + 75, 128)], fill=border_gold, width=1)
    draw.polygon([(center_cx, 125), (center_cx + 4, 128), (center_cx, 131), (center_cx - 4, 128)], fill=border_gold)

    # Product Title
    # Flowing script title
    draw.text((center_cx, 155), cfg.get("script_title", "Farmstead"), fill=border_gold, font=get_font(32, italic=True), anchor="mm")
    # Bold main title
    draw.text((center_cx, 192), cfg.get("main_title", "ROASTED MAKHANA"), fill=deep_green, font=get_font(21, True), anchor="mm")
    
    # Subtitle pill
    draw.rounded_rectangle([center_cx - 95, 212, center_cx + 95, 230], radius=9, fill=deep_green)
    draw.text((center_cx, 221), cfg.get("pill_text", "NATURAL JUMBO LOTUS SEEDS"), fill=(255, 245, 220), font=get_font(8, True), anchor="mm")

    # Central Medallion Illustration (e.g. Clay kadhai with puffed makhanas)
    med_cy = 310
    draw.ellipse([center_cx - 65, med_cy - 65, center_cx + 65, med_cy + 65], fill=parchment_color, outline=border_gold, width=3)
    draw.ellipse([center_cx - 58, med_cy - 58, center_cx + 58, med_cy + 58], outline=deep_green, width=1)
    
    # Earthen bowl & puffed makhanas illustration inside medallion
    draw.ellipse([center_cx - 42, med_cy + 2, center_cx + 42, med_cy + 35], fill=(160, 90, 50), outline=border_gold, width=2)
    draw.ellipse([center_cx - 35, med_cy - 8, center_cx + 35, med_cy + 15], fill=(200, 130, 80))
    # Puffed makhanas in bowl
    for mx, my in [(-18, -4), (-2, -12), (15, -5), (-25, 6), (0, 3), (22, 5), (-8, 14), (10, 15)]:
        draw.ellipse([center_cx + mx - 8, med_cy + my - 6, center_cx + mx + 8, med_cy + my + 6], fill=(255, 252, 245), outline=(135, 100, 60), width=1)
        draw.point((center_cx + mx, med_cy + my), fill=(70, 45, 20))

    # Medallion side banners: "Pure · Potent · Natural"
    draw.text((center_cx - 85, med_cy), "Pure", fill=border_gold, font=get_font(10, italic=True), anchor="mm")
    draw.text((center_cx + 85, med_cy), "Natural", fill=border_gold, font=get_font(10, italic=True), anchor="mm")

    # Bottom technique banner
    draw.rounded_rectangle([center_cx - 105, 395, center_cx + 105, 416], radius=10, fill=deep_green, outline=border_gold, width=1)
    draw.text((center_cx, 405), cfg.get("bottom_badge", "ANCIENT STONE-GROUND TECHNIQUE"), fill=(255, 245, 220), font=get_font(7, True), anchor="mm")

    # -------------------------------------------------------------
    # 3. RIGHT COLUMN: Vision, Specs, Nutrition (x: 375 to 498)
    # -------------------------------------------------------------
    col3_cx = 436
    draw.text((col3_cx, 105), "OUR VISION", fill=deep_green, font=get_font(9, True), anchor="mm")
    draw.text((col3_cx, 126), "To preserve Bharat's timeless\nharvests by delivering pure,\nwholesome nourishment to\nevery conscious home.", fill=dark_brown, font=get_font(6, False), anchor="mm", align="center")

    # Batch details
    details_y = 158
    specs = [
        ("Net Wt.", cfg.get("net_wt", "250 gm")),
        ("Batch No.", cfg.get("batch_no", "GDM 1126")),
        ("Mfg. Date", "Nov 2026"),
        ("Best Before", "9 Months from Mfg.")
    ]
    for lbl, val in specs:
        draw.text((380, details_y), f"{lbl} :", fill=deep_green, font=get_font(7, True))
        draw.text((440, details_y), val, fill=dark_brown, font=get_font(7, False))
        details_y += 14

    # Nutritional Information Table
    draw.rounded_rectangle([376, 224, 496, 345], radius=6, outline=border_gold, width=1)
    draw.rectangle([376, 224, 496, 240], fill=border_gold)
    draw.text((col3_cx, 232), "Nutritional Information", fill=parchment_color, font=get_font(7, True), anchor="mm")
    draw.text((col3_cx, 248), "(Per 100 g Approx. Values)", fill=dark_brown, font=get_font(6, italic=True), anchor="mm")

    nutri = cfg.get("nutrition", [
        ("Energy", "358 kcal"),
        ("Protein", "9.7 g"),
        ("Carbohydrate", "76.9 g"),
        ("Total Fat", "0.1 g"),
        ("Dietary Fibre", "7.6 g"),
        ("Calcium", "60 mg")
    ])
    ny = 258
    for p_name, p_val in nutri:
        draw.text((382, ny), p_name, fill=dark_brown, font=get_font(6, False))
        draw.text((465, ny), p_val, fill=deep_green, font=get_font(6, True))
        ny += 13

    # Clean Purity Claims & FSSAI
    draw.text((col3_cx, 360), "100% Pure · Zero Preservatives", fill=deep_green, font=get_font(7, True), anchor="mm")
    draw.text((col3_cx, 372), "Store in a cool dry place", fill=dark_brown, font=get_font(6, False), anchor="mm")
    
    # Vegetarian Dot Icon & FSSAI
    draw.rectangle([col3_cx - 30, 390, col3_cx - 16, 404], outline=(20, 130, 40), width=1)
    draw.ellipse([col3_cx - 26, 394, col3_cx - 20, 400], fill=(20, 130, 40))
    draw.text((col3_cx + 12, 397), "fssai", fill=border_gold, font=get_font(9, True), anchor="mm")

    return label

def generate_luxury_jar_photo(cfg, out_filename):
    """
    Composites the full luxury studio photograph matching the user's provided ghee photo:
    - Base studio lighting & wooden table
    - Glass jar filled with 3D photorealistic product fill
    - Mughal arched 3-column parchment label
    - Branded circular emblem on the gold lid
    - Neck strap with gold leaf filigree
    - Die-cut hanging tag on golden twine
    - Handcrafted wooden bowl filled with the product in foreground
    - Natural glass reflections and warm studio lighting
    """
    result = base_img.copy()

    # 1. Fill inside the glass jar with photorealistic 3D product texture
    jar_left, jar_top, jar_right, jar_bottom = 260, 190, 760, 930
    jar_w = jar_right - jar_left
    jar_h = jar_bottom - jar_top

    # Generate organic 3D puffed makhanas cluster
    fill_img = Image.new('RGBA', (jar_w, jar_h), (242, 235, 222, 255))
    draw_f = ImageDraw.Draw(fill_img)

    # Ambient occlusion gradient
    for y in range(jar_h):
        shadow = int(22 * math.sin(y / jar_h * math.pi))
        draw_f.line([(0, y), (jar_w, y)], fill=(235 - shadow, 225 - shadow, 210 - shadow, 255))

    random.seed(4242)
    # 400 overlapping organic roasted makhanas with realistic light/shadow
    for _ in range(400):
        cx = random.randint(15, jar_w - 15)
        cy = random.randint(15, jar_h - 15)
        rx = random.randint(20, 35)
        ry = random.randint(16, 30)
        # Drop shadow
        draw_f.ellipse([cx - rx - 2, cy - ry - 1, cx + rx + 3, cy + ry + 3], fill=(145, 120, 95, 160))
        # Puffed cream body
        draw_f.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(252, 248, 238, 255))
        # Warm golden-brown toasted highlights
        draw_f.ellipse([cx - rx + 4, cy - ry + 4, cx + rx - 2, cy + ry - 2], fill=(255, 253, 248, 255))
        # Natural dark brown seed coat indentations
        if random.random() > 0.35:
            ang = random.uniform(0, 2 * math.pi)
            sx = cx + int(rx * 0.45 * math.cos(ang))
            sy = cy + int(ry * 0.45 * math.sin(ang))
            draw_f.ellipse([sx - 3, sy - 2, sx + 3, sy + 2], fill=(85, 55, 30, 230))
            draw_f.ellipse([sx - 1, sy - 1, sx + 1, sy + 1], fill=(45, 25, 10, 255))

    fill_img = fill_img.filter(ImageFilter.GaussianBlur(radius=0.4))

    # Jar mask
    jar_mask = Image.new('L', (jar_w, jar_h), 0)
    draw_jm = ImageDraw.Draw(jar_mask)
    draw_jm.rounded_rectangle([8, 8, jar_w - 8, jar_h - 8], radius=40, fill=245)
    jar_mask = jar_mask.filter(ImageFilter.GaussianBlur(radius=5))

    result.paste(fill_img, (jar_left, jar_top), jar_mask)

    # 2. Specular glass reflections & curved highlights
    sheen = Image.new('RGBA', (jar_w, jar_h), (0, 0, 0, 0))
    draw_s = ImageDraw.Draw(sheen)
    # Left bright specular rim
    draw_s.rectangle([20, 15, 45, jar_h - 15], fill=(255, 255, 255, 80))
    # Right soft reflection
    draw_s.rectangle([jar_w - 50, 15, jar_w - 30, jar_h - 15], fill=(255, 255, 255, 55))
    # Curved shoulder highlight
    draw_s.ellipse([40, 8, jar_w - 40, 65], fill=(255, 255, 255, 65))
    sheen = sheen.filter(ImageFilter.GaussianBlur(radius=7))
    result.alpha_composite(sheen, (jar_left, jar_top))

    # 3. Gold & Dark Green Neck Strap running from under lid down to label
    strap_w, strap_h = 44, 180
    strap_x = W // 2 - strap_w // 2
    strap_y = 155
    strap = Image.new('RGBA', (strap_w, strap_h), (22, 54, 34, 255))
    draw_str = ImageDraw.Draw(strap)
    # Gold borders & leaf filigree
    draw_str.rectangle([2, 0, strap_w - 3, strap_h], outline=(196, 142, 60), width=2)
    for fy in range(15, strap_h - 15, 22):
        draw_str.ellipse([strap_w//2 - 6, fy, strap_w//2 + 6, fy + 12], fill=(215, 165, 75))
    result.alpha_composite(strap, (strap_x, strap_y))

    # 4. Top Lid Circular Branded Emblem
    lid_emb_w, lid_emb_h = 240, 75
    lid_emb_x = W // 2 - lid_emb_w // 2
    lid_emb_y = 65
    lid_emb = Image.new('RGBA', (lid_emb_w, lid_emb_h), (0, 0, 0, 0))
    draw_le = ImageDraw.Draw(lid_emb)
    # Golden curved ellipse
    draw_le.ellipse([4, 4, lid_emb_w - 5, lid_emb_h - 5], fill=(245, 238, 222), outline=(196, 142, 60), width=3)
    draw_le.ellipse([8, 8, lid_emb_w - 9, lid_emb_h - 9], outline=(22, 54, 34), width=1)
    draw_le.text((lid_emb_w//2, lid_emb_h//2 - 6), "GAVYADHENU", fill=(22, 54, 34), font=get_font(13, True), anchor="mm")
    draw_le.text((lid_emb_w//2, lid_emb_h//2 + 10), cfg.get("lid_sub", "ROASTED MAKHANA"), fill=(196, 142, 60), font=get_font(9, True), anchor="mm")
    result.alpha_composite(lid_emb, (lid_emb_x, lid_emb_y))

    # 5. Grand Mughal Arch Parchment Label
    lbl_w, lbl_h = 540, 560
    lbl_x = W // 2 - lbl_w // 2
    lbl_y = 295

    label_img = draw_mughal_arch_label(cfg)

    # Label drop shadow for 3D depth on glass
    lbl_shadow = Image.new('RGBA', (lbl_w + 30, lbl_h + 30), (0, 0, 0, 0))
    draw_lsh = ImageDraw.Draw(lbl_shadow)
    draw_lsh.rounded_rectangle([15, 15, lbl_w + 15, lbl_h + 15], radius=24, fill=(35, 20, 10, 110))
    lbl_shadow = lbl_shadow.filter(ImageFilter.GaussianBlur(radius=8))
    result.alpha_composite(lbl_shadow, (lbl_x - 15, lbl_y - 15))

    # Paste arched label
    result.alpha_composite(label_img, (lbl_x, lbl_y))

    # 6. Die-Cut Hanging Tag on Golden Twine
    tag_w, tag_h = 190, 280
    tag_x, tag_y = 665, 185
    tag = Image.new('RGBA', (tag_w, tag_h), (0, 0, 0, 0))
    draw_tg = ImageDraw.Draw(tag)
    
    # Scalloped die-cut parchment tag
    draw_tg.rounded_rectangle([8, 8, tag_w - 8, tag_h - 8], radius=16, fill=(252, 247, 235), outline=(196, 142, 60), width=3)
    draw_tg.rounded_rectangle([14, 14, tag_w - 14, tag_h - 14], radius=12, outline=(22, 54, 34), width=1)
    
    # Twine cord hole & brass eyelet
    draw_tg.ellipse([tag_w//2 - 8, 16, tag_w//2 + 8, 32], fill=(160, 120, 60), outline=(100, 70, 30), width=2)
    draw_tg.ellipse([tag_w//2 - 5, 19, tag_w//2 + 5, 29], fill=(220, 180, 110))

    # Cow emblem on tag
    draw_tg.ellipse([tag_w//2 - 20, 52, tag_w//2 + 20, 78], outline=(196, 142, 60), width=1)
    draw_tg.text((tag_w//2, 64), "卐", fill=(196, 142, 60), font=get_font(12, True), anchor="mm")
    
    draw_tg.text((tag_w//2, 92), "GAVYADHENU", fill=(22, 54, 34), font=get_font(12, True), anchor="mm")
    draw_tg.text((tag_w//2, 107), "Celebrating Bharat's Flavours", fill=(196, 142, 60), font=get_font(7, italic=True), anchor="mm")
    
    draw_tg.line([(28, 118), (tag_w - 28, 118)], fill=(196, 142, 60), width=1)
    
    draw_tg.text((tag_w//2, 145), cfg.get("tag_script", "Makhana"), fill=(196, 142, 60), font=get_font(26, italic=True), anchor="mm")
    draw_tg.text((tag_w//2, 175), "ROASTED", fill=(22, 54, 34), font=get_font(12, True), anchor="mm")
    
    draw_tg.line([(28, 195), (tag_w - 28, 195)], fill=(196, 142, 60), width=1)
    
    draw_tg.text((tag_w//2, 215), "100% PURE JUMBO", fill=(22, 54, 34), font=get_font(8, True), anchor="mm")
    draw_tg.text((tag_w//2, 230), "Slow Fire Roasted", fill=(120, 85, 45), font=get_font(8, False), anchor="mm")
    draw_tg.text((tag_w//2, 252), "NET WT. 250g", fill=(196, 142, 60), font=get_font(9, True), anchor="mm")

    # Rotate tag slightly (12 degrees)
    rot_tag = tag.rotate(-11, expand=True, resample=Image.BICUBIC)
    result.alpha_composite(rot_tag, (tag_x, tag_y))

    # 7. Foreground Handcrafted Wooden Bowl Filled with Puffed Makhanas
    # Overlay in place of the spoon of ghee
    bowl_w, bowl_h = 500, 360
    bowl_x, bowl_y = 10, 680
    bowl_layer = Image.new('RGBA', (bowl_w, bowl_h), (0, 0, 0, 0))
    draw_bw = ImageDraw.Draw(bowl_layer)

    # Bowl shadow on wooden table
    draw_bw.ellipse([25, 90, 480, 335], fill=(30, 18, 10, 180))

    # Carved dark teak wooden bowl body
    draw_bw.ellipse([35, 80, 470, 320], fill=(70, 38, 20, 255), outline=(130, 80, 45), width=6)
    # Bowl interior hollow
    draw_bw.ellipse([55, 95, 450, 295], fill=(95, 52, 28, 255), outline=(155, 100, 55), width=2)

    # Overflowing mound of plump, crunchy, toasted white makhanas
    random.seed(8811)
    for _ in range(120):
        bx = random.randint(75, 430)
        by = random.randint(90, 270)
        brx = random.randint(20, 32)
        bry = random.randint(16, 26)
        # Drop shadow between makhanas
        draw_bw.ellipse([bx - brx - 2, by - bry - 1, bx + brx + 2, by + bry + 2], fill=(50, 30, 15, 180))
        # Cream body
        draw_bw.ellipse([bx - brx, by - bry, bx + brx, by + bry], fill=(252, 248, 238, 255))
        # Warm highlight
        draw_bw.ellipse([bx - brx + 3, by - bry + 3, bx + brx - 2, by + bry - 2], fill=(255, 254, 250, 255))
        # Brown toasted seed indentations
        if random.random() > 0.4:
            draw_bw.ellipse([bx - 3, by - 2, bx + 3, by + 2], fill=(85, 55, 25, 240))
            draw_bw.point((bx, by), fill=(40, 20, 10))

    # Loose makhanas scattered on the dark wooden table
    scattered = [(15, 290), (45, 330), (460, 310), (490, 280), (280, 335), (320, 340)]
    for sx, sy in scattered:
        draw_bw.ellipse([sx - 16, sy - 12, sx + 16, sy + 12], fill=(252, 248, 238), outline=(125, 95, 60), width=1)
        draw_bw.point((sx, sy), fill=(70, 45, 20))

    bowl_layer = bowl_layer.filter(ImageFilter.GaussianBlur(radius=0.35))
    result.alpha_composite(bowl_layer, (bowl_x, bowl_y))

    # Save as high-quality binary JPEG
    outpath = os.path.join('client/public/products', out_filename)
    result.convert('RGB').save(outpath, 'JPEG', quality=95)
    print(f"Generated luxury Mughal-arch photo: {outpath} ({os.path.getsize(outpath)} bytes)")

# 1. Generate Farmstead Roasted Makhana
makhana_cfg = {
    "col1_title": "POWER OF MAKHANA",
    "col1_sub": "A sacred wetland superfood\ncelebrated for high protein,\nlight digestion and vitality.",
    "benefits": [
        ("High Protein", "Builds natural stamina"),
        ("Zero Trans Fats", "Heart friendly"),
        ("Light Digestion", "Gentle on gut"),
        ("Rich in Calcium", "Strengthens bones"),
        ("100% Natural", "No chemical additives")
    ],
    "script_title": "Farmstead",
    "main_title": "ROASTED MAKHANA",
    "pill_text": "NATURAL JUMBO LOTUS SEEDS",
    "bottom_badge": "SLOW-ROASTED IN CLAY KADHAI",
    "net_wt": "250 gm",
    "batch_no": "GDM 1126",
    "nutrition": [
        ("Energy", "358 kcal"),
        ("Protein", "9.7 g"),
        ("Carbohydrate", "76.9 g"),
        ("Total Fat", "0.1 g"),
        ("Dietary Fibre", "7.6 g"),
        ("Calcium", "60 mg")
    ],
    "lid_sub": "ROASTED MAKHANA",
    "tag_script": "Makhana"
}

generate_luxury_jar_photo(makhana_cfg, "farmstead-makhana.jpg")

# 2. Wildflower Honey
honey_cfg = {
    "col1_title": "SATPURA WILD NECTAR",
    "col1_sub": "Unprocessed forest nectar\nrich in natural enzymes,\npollens & antioxidants.",
    "benefits": [
        ("Raw & Unheated", "Pure forest enzymes"),
        ("Immunity Power", "Natural bio-flavonoids"),
        ("Cough & Throat", "Ayurvedic soothing"),
        ("Zero Sugar Added", "100% bee harvested"),
        ("Wild Multi-Flora", "Deep forest flowers")
    ],
    "script_title": "Wildflower",
    "main_title": "RAW FOREST HONEY",
    "pill_text": "UNPASTEURIZED & UNFILTERED",
    "bottom_badge": "SUSTAINABLE FOREST HARVEST",
    "net_wt": "250 gm",
    "batch_no": "GDH 1126",
    "nutrition": [
        ("Energy", "304 kcal"),
        ("Natural Sugars", "82.4 g"),
        ("Carbohydrate", "82.4 g"),
        ("Total Fat", "0.0 g"),
        ("Protein", "0.3 g"),
        ("Natural Minerals", "75 mg")
    ],
    "lid_sub": "FOREST HONEY",
    "tag_script": "Honey"
}
generate_luxury_jar_photo(honey_cfg, "wildflower-honey.jpg")

# 3. Chana Sattu Powder
sattu_cfg = {
    "col1_title": "DESI BENGAL CHANA",
    "col1_sub": "Ancient Bihar energy powerhouse,\nhigh in plant protein &\ngut cooling fibres.",
    "benefits": [
        ("26% Plant Protein", "Powers muscle strength"),
        ("Natural Stamina", "Sustained daily energy"),
        ("Gut Cooling", "Traditional summer drink"),
        ("Low GI", "Balances blood sugar"),
        ("100% Whole Chana", "Stone chakki ground")
    ],
    "script_title": "Wood-Fired",
    "main_title": "ROASTED SATTU POWDER",
    "pill_text": "ANCIENT DESI POWER SUPERFOOD",
    "bottom_badge": "SLOW CHAKKI STONE GROUND",
    "net_wt": "500 gm",
    "batch_no": "GDS 1126",
    "nutrition": [
        ("Energy", "385 kcal"),
        ("Protein", "25.6 g"),
        ("Carbohydrate", "64.2 g"),
        ("Total Fat", "5.2 g"),
        ("Dietary Fibre", "16.8 g"),
        ("Iron", "8.5 mg")
    ],
    "lid_sub": "CHANA SATTU",
    "tag_script": "Sattu"
}
generate_luxury_jar_photo(sattu_cfg, "sattu-powder.jpg")

# 4. MP Sharbati Wheat Flour
wheat_cfg = {
    "col1_title": "SEHORE GOLDEN WHEAT",
    "col1_sub": "Rain-fed Malwa wheat,\nslow-ground with bran & germ\nfor fragrant soft rotis.",
    "benefits": [
        ("100% Whole Grain", "Bran & germ intact"),
        ("Zero Maida", "Pure unbleached grain"),
        ("Soft Rotis", "Pillowy & aromatic"),
        ("Rich in Fiber", "Healthy digestive tract"),
        ("Stone Ground", "Cold chakki milled")
    ],
    "script_title": "Sharbati",
    "main_title": "DESI WHEAT FLOUR",
    "pill_text": "TRADITIONAL CHAKKI FRESH ATTA",
    "bottom_badge": "COLD STONE CHAKKI MILLED",
    "net_wt": "5 kg",
    "batch_no": "GDW 1126",
    "nutrition": [
        ("Energy", "340 kcal"),
        ("Protein", "12.1 g"),
        ("Carbohydrate", "72.0 g"),
        ("Total Fat", "1.7 g"),
        ("Dietary Fibre", "11.2 g"),
        ("Iron", "4.1 mg")
    ],
    "lid_sub": "WHEAT ATTA",
    "tag_script": "Flour"
}
generate_luxury_jar_photo(wheat_cfg, "mp-sharbati-wheat-flour.jpg")

# 5. Quiet Morning Tulsi Brew
tulsi_cfg = {
    "col1_title": "SACRED TULSI TRIAD",
    "col1_sub": "Krishna, Rama & Vana Tulsi\nblended with green cardamom\nfor calming balance.",
    "benefits": [
        ("Caffeine Free", "Pure soothing herbs"),
        ("Adaptogenic", "Balances daily stress"),
        ("Immunity Shield", "Respiratory wellness"),
        ("Natural Aroma", "Cardamom infusion"),
        ("Hand Picked", "Sanctuary gardens")
    ],
    "script_title": "Quiet Morning",
    "main_title": "HERBAL TULSI BREW",
    "pill_text": "SINGLE-ORIGIN AYURVEDIC INFUSION",
    "bottom_badge": "ANCIENT HERBAL HARVEST",
    "net_wt": "40 gm",
    "batch_no": "GDT 1126",
    "nutrition": [
        ("Energy", "0 kcal"),
        ("Active Tulsi Oils", "1.4%"),
        ("Cardamom Extracts", "18.5%"),
        ("Caffeine", "0.0 mg"),
        ("Antioxidants", "High Polyphenols"),
        ("Preservatives", "Zero Added")
    ],
    "lid_sub": "TULSI BREW",
    "tag_script": "Herbal Tea"
}
generate_luxury_jar_photo(tulsi_cfg, "quiet-morning-brew.jpg")

# 6. Wood Ash Utensil Cleaner
ash_cfg = {
    "col1_title": "SACRED COW DUNG ASH",
    "col1_sub": "Chemical-free dish cleaner\ncrafted with wood ash,\nlemon oil & neem.",
    "benefits": [
        ("100% Non-Toxic", "Safe for hands & food"),
        ("Removes Grease", "Natural alkaline cut"),
        ("Gleaming Brass", "Shines copper & bronze"),
        ("Compost Safe", "Greywater garden safe"),
        ("Zero Chemicals", "Ancient Vedic secret")
    ],
    "script_title": "Desi Wood Ash",
    "main_title": "UTENSIL CLEANER",
    "pill_text": "NATURAL CHEMICAL-FREE SCRUB",
    "bottom_badge": "SACRED HERBAL WOOD ASH",
    "net_wt": "500 gm",
    "batch_no": "GDA 1126",
    "nutrition": [
        ("Cow Dung Ash", "70%"),
        ("Neem Powder", "15%"),
        ("Lemon Peel Oil", "10%"),
        ("Natural Soda", "5%"),
        ("Chemical Dyes", "0%"),
        ("Phosphates", "0%")
    ],
    "lid_sub": "DISH SCRUB",
    "tag_script": "Wood Ash"
}
generate_luxury_jar_photo(ash_cfg, "wood-ash-cleaner.jpg")
