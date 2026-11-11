import json
import os
import time
import urllib.parse
import urllib.request
from PIL import Image, ImageOps

DEST_DIR = "client/public/products"
HEADERS = {
    "User-Agent": "GavyadhenuCatalogUpdater/1.0 (https://gavyadhenu.farm; tech@gavyadhenu.farm) Python-urllib/3.12"
}

TARGETS = [
    ("Gir cattle", "pashu-starter-pack.jpg"),
    ("Azadirachta indica leaves", "pashu-starter-spray.jpg"),
    ("Mustard seeds macro", "yellow-mustard-oil-seeds.jpg"),
    ("Coriandrum sativum seeds", "coriander-powder-seeds.jpg"),
    ("Peanuts shelled", "groundnut-oil-peanuts.jpg"),
    ("Ghee clarified butter", "bilona-a2-ghee-texture.jpg"),
]

def search_commons(query: str):
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
        if info.get("mime") in ("image/jpeg", "image/png") and info.get("width", 0) >= 600 and info.get("height", 0) >= 450:
            return info["url"]
    return None

def save_square(url: str, filename: str):
    tmp = os.path.join("scripts", "tmp_" + filename)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=25) as resp, open(tmp, "wb") as f:
        f.write(resp.read())
    with Image.open(tmp) as im:
        im = ImageOps.exif_transpose(im)
        w, h = im.size
        s = min(w, h)
        left = (w - s) // 2
        top = (h - s) // 2
        sq = im.crop((left, top, left + s, top + s)).resize((1024, 1024), Image.LANCZOS)
        out_path = os.path.join(DEST_DIR, filename)
        sq.convert("RGB").save(out_path, "JPEG", quality=93)
        print(f"OK {filename}: {url}")
    if os.path.exists(tmp):
        os.remove(tmp)

if __name__ == "__main__":
    for q, fname in TARGETS:
        try:
            u = search_commons(q)
            if u:
                save_square(u, fname)
            else:
                print(f"MISS {fname}")
        except Exception as e:
            print(f"ERR {fname}: {e}")
        time.sleep(2.2)
