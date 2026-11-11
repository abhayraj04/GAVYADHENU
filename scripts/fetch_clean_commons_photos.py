import os
import time
import urllib.request
from PIL import Image

DEST_DIR = "client/public/products"
os.makedirs(DEST_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "GavyadhenuCatalogUpdater/1.0 (https://gavyadhenu.farm; tech@gavyadhenu.farm) Python-urllib/3.12"
}

PHOTOS_TO_FETCH = [
    ("https://upload.wikimedia.org/wikipedia/commons/3/30/Roasted_Chickpea_Chana_with_Salt_and_Turmeric.jpg", "sattu-powder.jpg"),
    ("https://upload.wikimedia.org/wikipedia/commons/6/66/Whole_wheat_grain_flour_being_scooped.jpg", "mp-sharbati-wheat-flour.jpg"),
    ("https://upload.wikimedia.org/wikipedia/commons/6/6f/Herbal_Tea_01.jpg", "quiet-morning-brew.jpg"),
    ("https://upload.wikimedia.org/wikipedia/commons/2/25/Bathing_scrubbers_made_from_coir_fibers.jpg", "coconut-scrubber.jpg"),
    ("https://upload.wikimedia.org/wikipedia/commons/1/13/Honey_spoon_2.jpg", "wildflower-honey-drip.jpg"),
    ("https://upload.wikimedia.org/wikipedia/commons/4/4e/Honeycomb_with_honey.jpg", "wildflower-honey-comb.jpg"),
    ("https://upload.wikimedia.org/wikipedia/commons/8/87/Gir_Cow_in_Gujarat.jpg", "pashu-starter-pack.jpg"),
    ("https://upload.wikimedia.org/wikipedia/commons/e/e5/Ghee_in_wooden_bowl.jpg", "bilona-a2-ghee-texture.jpg"),
    ("https://upload.wikimedia.org/wikipedia/commons/4/45/Yellow_mustard_seeds.jpg", "yellow-mustard-oil-seeds.jpg"),
    ("https://upload.wikimedia.org/wikipedia/commons/0/0c/Peanuts_%28Arachis_hypogaea%29_-_in_shell%2C_shell_cracked_open%2C_shelled%2C_peeled.jpg", "groundnut-oil-peanuts.jpg"),
]

def fetch_and_square(url: str, filename: str) -> bool:
    tmp = os.path.join("scripts", "tmp_" + filename)
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=20) as resp, open(tmp, "wb") as f:
                f.write(resp.read())
            with Image.open(tmp) as im:
                w, h = im.size
                s = min(w, h)
                left = (w - s) // 2
                top = (h - s) // 2
                sq = im.crop((left, top, left + s, top + s)).resize((1024, 1024), Image.LANCZOS)
                out_path = os.path.join(DEST_DIR, filename)
                sq.convert("RGB").save(out_path, "JPEG", quality=94)
                print(f"OK: {filename} ({os.path.getsize(out_path)} bytes)")
            if os.path.exists(tmp):
                os.remove(tmp)
            return True
        except Exception as e:
            print(f"Attempt {attempt+1} failed for {filename}: {e}")
            time.sleep(3 * (attempt + 1))
    if os.path.exists(tmp):
        os.remove(tmp)
    return False

if __name__ == "__main__":
    for url, fname in PHOTOS_TO_FETCH:
        fetch_and_square(url, fname)
        time.sleep(2.5)
