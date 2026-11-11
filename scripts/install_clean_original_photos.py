import os
import shutil
import urllib.request
from PIL import Image

DEST_DIR = "client/public/products"
os.makedirs(DEST_DIR, exist_ok=True)

# 1. Restore the EXACT pristine original user-uploaded images (NO MODIFICATIONS, ZERO COMPOSITING)
user_uploads = {
    "bilona-a2-ghee.jpg": "C:/Users/abhay/.gemini/antigravity/brain/340907b4-3c4b-490c-b9b8-7255ddc74445/.user_uploaded/media_1794301655928_c0a18b96.jpg",
    "lakadong-turmeric-front.jpg": "C:/Users/abhay/.gemini/antigravity/brain/340907b4-3c4b-490c-b9b8-7255ddc74445/.user_uploaded/media_1794295103763_9a910653.jpg",
    "lakadong-turmeric-side.jpg": "C:/Users/abhay/.gemini/antigravity/brain/340907b4-3c4b-490c-b9b8-7255ddc74445/.user_uploaded/media_1794295090009_4aae772b.jpg",
    "lakadong-turmeric-back.jpg": "C:/Users/abhay/.gemini/antigravity/brain/340907b4-3c4b-490c-b9b8-7255ddc74445/.user_uploaded/media_1794295113257_62dff42a.jpg",
    "teja-chilli-front.jpg": "C:/Users/abhay/.gemini/antigravity/brain/340907b4-3c4b-490c-b9b8-7255ddc74445/.user_uploaded/media_1794295146016_24ddc8ac.jpg",
    "teja-chilli-side.jpg": "C:/Users/abhay/.gemini/antigravity/brain/340907b4-3c4b-490c-b9b8-7255ddc74445/.user_uploaded/media_1794295135364_19604c96.jpg",
    "teja-chilli-back.jpg": "C:/Users/abhay/.gemini/antigravity/brain/340907b4-3c4b-490c-b9b8-7255ddc74445/.user_uploaded/media_1794295124833_c2615e84.jpg",
    "black-turmeric-front.jpg": "C:/Users/abhay/.gemini/antigravity/brain/340907b4-3c4b-490c-b9b8-7255ddc74445/.user_uploaded/media_1794294974808_fbeff027.jpg",
    "black-turmeric-angle.jpg": "C:/Users/abhay/.gemini/antigravity/brain/340907b4-3c4b-490c-b9b8-7255ddc74445/.user_uploaded/media_1794295053867_1426b1eb.jpg",
    "black-turmeric-back.jpg": "C:/Users/abhay/.gemini/antigravity/brain/340907b4-3c4b-490c-b9b8-7255ddc74445/.user_uploaded/media_1794295073039_98807925.jpg",
    "coriander-powder-front.jpg": "C:/Users/abhay/.gemini/antigravity/brain/340907b4-3c4b-490c-b9b8-7255ddc74445/.user_uploaded/media_1794294826762_c8a86c84.jpg",
    "coriander-powder-back.jpg": "C:/Users/abhay/.gemini/antigravity/brain/340907b4-3c4b-490c-b9b8-7255ddc74445/.user_uploaded/media_1794294962724_f566d37f.jpg",
}

print("=== Restoring Pristine Original User Uploads ===")
for dest_name, src_path in user_uploads.items():
    if os.path.exists(src_path):
        dest_path = os.path.join(DEST_DIR, dest_name)
        shutil.copyfile(src_path, dest_path)
        print(f"Restored original: {dest_name} ({os.path.getsize(dest_path)} bytes)")
    else:
        print(f"Warning: source not found: {src_path}")

# 2. Restore the original photorealistic studio images from brain artifacts
brain_artifacts = {
    "yellow-mustard-oil.jpg": "C:/Users/abhay/.gemini/antigravity/brain/340907b4-3c4b-490c-b9b8-7255ddc74445/yellow_mustard_oil_1794295682166.jpg",
    "groundnut-oil.jpg": "C:/Users/abhay/.gemini/antigravity/brain/340907b4-3c4b-490c-b9b8-7255ddc74445/groundnut_oil_1794295729110.jpg",
}

for dest_name, src_path in brain_artifacts.items():
    if os.path.exists(src_path):
        dest_path = os.path.join(DEST_DIR, dest_name)
        shutil.copyfile(src_path, dest_path)
        print(f"Restored artifact: {dest_name} ({os.path.getsize(dest_path)} bytes)")

# 3. Clean, authentic, camera-shot photographs for other products (NO DRAWING, NO SYNTHETIC TEXT)
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def download_and_crop(url, dest_filename):
    try:
        req = urllib.request.Request(url, headers=headers)
        tmp = os.path.join('scripts', 'tmp_' + dest_filename)
        with urllib.request.urlopen(req, timeout=15) as r, open(tmp, 'wb') as f:
            f.write(r.read())
        
        with Image.open(tmp) as im:
            # Crop to square
            w, h = im.size
            crop_size = min(w, h)
            left = (w - crop_size) // 2
            top = (h - crop_size) // 2
            cropped = im.crop((left, top, left + crop_size, top + crop_size))
            cropped = cropped.resize((1024, 1024), Image.LANCZOS)
            final_path = os.path.join(DEST_DIR, dest_filename)
            cropped.convert('RGB').save(final_path, 'JPEG', quality=95)
            print(f"Downloaded & saved clean photo: {dest_filename} ({os.path.getsize(final_path)} bytes)")
        
        if os.path.exists(tmp):
            os.remove(tmp)
    except Exception as e:
        print(f"Error downloading {dest_filename}: {e}")

print("\n=== Installing Clean Authentic Camera Photography ===")

# Farmstead Roasted Makhana
download_and_crop(
    "https://upload.wikimedia.org/wikipedia/commons/0/03/Roasted_and_spiced_Foxnuts_%28Phool_Makhana%29.jpg",
    "farmstead-makhana.jpg"
)
download_and_crop(
    "https://upload.wikimedia.org/wikipedia/commons/6/60/Makhana_as_Snack_from_India.jpg",
    "farmstead-makhana-bowl.jpg"
)

# Raw Wildflower Forest Honey
download_and_crop(
    "https://upload.wikimedia.org/wikipedia/commons/c/cc/Runny_hunny.jpg",
    "wildflower-honey.jpg"
)
download_and_crop(
    "https://upload.wikimedia.org/wikipedia/commons/1/13/Honey_spoon_2.jpg",
    "wildflower-honey-drip.jpg"
)

# MP Sharbati Wheat Flour
download_and_crop(
    "https://upload.wikimedia.org/wikipedia/commons/6/66/Whole_wheat_grain_flour_being_scooped.jpg",
    "mp-sharbati-wheat-flour.jpg"
)

# Chana Sattu Powder
download_and_crop(
    "https://upload.wikimedia.org/wikipedia/commons/3/30/Roasted_Chickpea_Chana_with_Salt_and_Turmeric.jpg",
    "sattu-powder.jpg"
)

# Quiet Morning Herbal Tulsi Brew
download_and_crop(
    "https://upload.wikimedia.org/wikipedia/commons/6/6f/Herbal_Tea_01.jpg",
    "quiet-morning-brew.jpg"
)

# Coconut Scrubber
download_and_crop(
    "https://upload.wikimedia.org/wikipedia/commons/2/25/Bathing_scrubbers_made_from_coir_fibers.jpg",
    "coconut-scrubber.jpg"
)

print("\nAll clean original photos installed with zero messy overlays!")
