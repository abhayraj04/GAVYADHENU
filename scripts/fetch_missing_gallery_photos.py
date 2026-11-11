import json
import os
import time
import urllib.parse
import urllib.request
from PIL import Image

DEST_DIR = "client/public/products"
HEADERS = {
    "User-Agent": "GavyadhenuCatalogUpdater/1.0 (https://gavyadhenu.farm; tech@gavyadhenu.farm) Python-urllib/3.12"
}

SEARCHES = [
    ("Gir cow India dairy", "pashu-starter-pack.jpg"),
    ("Ghee clarified butter bowl", "bilona-a2-ghee-texture.jpg"),
    ("Mustard seeds yellow spice", "yellow-mustard-oil-seeds.jpg"),
    ("Raw peanuts shelled bowl", "groundnut-oil-peanuts.jpg"),
    ("Honeycomb beeswax honey", "wildflower-honey-comb.jpg"),
    ("Coriander seeds spice bowl", "coriander-powder-seeds.jpg"),
    ("Wheat grain harvest golden", "mp-sharbati-wheat-flour-grain.jpg"),
    ("Tulsi holy basil plant leaves", "quiet-morning-brew-leaves.jpg"),
    ("Diya clay oil lamp flame", "earthen-candle-flame.jpg"),
    ("Sattu drink chickpea flour", "sattu-powder-drink.jpg"),
]

def search_commons_image(query: str):
    params = urllib.parse.urlencode({
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": f"filetype:bitmap {query}",
        "gsrnamespace": "6",
        "gsrlimit": "6",
        "prop": "imageinfo",
        "iiprop": "url|size|mime",
    })
    url = f"https://commons.wikimedia.org/w/api.php?{params}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        infos = page.get("imageinfo", [])
        if not infos:
            continue
        info = infos[0]
        mime = info.get("mime", "")
        w = info.get("width", 0)
        h = info.get("height", 0)
        if mime in ("image/jpeg", "image/png") and w >= 600 and h >= 500:
            return info["url"]
    return None

def download_and_square(url: str, filename: str):
    tmp = os.path.join("scripts", "tmp_" + filename)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=25) as resp, open(tmp, "wb") as f:
        f.write(resp.read())
    with Image.open(tmp) as im:
        w, h = im.size
        s = min(w, h)
        left = (w - s) // 2
        top = (h - s) // 2
        sq = im.crop((left, top, left + s, top + s)).resize((1024, 1024), Image.LANCZOS)
        out_path = os.path.join(DEST_DIR, filename)
        sq.convert("RGB").save(out_path, "JPEG", quality=93)
        print(f"SAVED: {filename} ({os.path.getsize(out_path)} bytes) from {url}")
    if os.path.exists(tmp):
        os.remove(tmp)

if __name__ == "__main__":
    for q, fname in SEARCHES:
        try:
            img_url = search_commons_image(q)
            if img_url:
                download_and_square(img_url, fname)
            else:
                print(f"NO_MATCH: {fname}")
        except Exception as e:
            print(f"ERROR {fname}: {e}")
        time.sleep(2.5)
