import os
import shutil
from PIL import Image

src = 'C:/Users/abhay/.gemini/antigravity/brain/340907b4-3c4b-490c-b9b8-7255ddc74445/.user_uploaded/media_1794327353701_fbc04a47.jpg'
dest_dir = 'client/public'
os.makedirs(dest_dir, exist_ok=True)

# 1. Direct copy
shutil.copyfile(src, os.path.join(dest_dir, 'gavyadhenu-logo.jpg'))

# 2. Transparent PNG (convert pure white background to transparent)
im = Image.open(src).convert('RGBA')
datas = im.getdata()

new_data = []
for item in datas:
    # If pixel is near white (R>245, G>245, B>245), make it transparent
    if item[0] > 242 and item[1] > 242 and item[2] > 242:
        # Smooth alpha falloff for antialiasing
        diff = max(item[0], item[1], item[2]) - 242
        alpha = int(max(0, 255 - diff * 20))
        new_data.append((item[0], item[1], item[2], alpha))
    else:
        new_data.append(item)

im.putdata(new_data)
# Crop bounding box of non-transparent pixels
bbox = im.getbbox()
if bbox:
    # Add small padding
    pad = 12
    bbox = (max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(im.width, bbox[2]+pad), min(im.height, bbox[3]+pad))
    cropped_im = im.crop(bbox)
else:
    cropped_im = im

cropped_im.save(os.path.join(dest_dir, 'gavyadhenu-logo.png'), 'PNG')
print('Saved transparent logo:', os.path.join(dest_dir, 'gavyadhenu-logo.png'), cropped_im.size)

# Also save square version for header/favicon/avatar
sq_size = max(cropped_im.width, cropped_im.height)
sq_im = Image.new('RGBA', (sq_size, sq_size), (0, 0, 0, 0))
ox = (sq_size - cropped_im.width) // 2
oy = (sq_size - cropped_im.height) // 2
sq_im.paste(cropped_im, (ox, oy), cropped_im)
sq_im.save(os.path.join(dest_dir, 'gavyadhenu-emblem.png'), 'PNG')
print('Saved emblem:', os.path.join(dest_dir, 'gavyadhenu-emblem.png'), sq_im.size)

# Also save favicon
favicon = sq_im.resize((64, 64), Image.LANCZOS)
favicon.save(os.path.join(dest_dir, 'favicon.png'), 'PNG')
print('Saved favicon.png')
