import os
import re

with open('client/src/productGalleries.ts', 'r', encoding='utf-8') as f:
    text = f.read()

paths = re.findall(r'"(/products/[^"]+\.jpg)"', text)
print(f"Total paths in galleries: {len(paths)}")
all_ok = True
for p in paths:
    full = os.path.join('client/public', p.lstrip('/'))
    if not os.path.exists(full):
        print(f"MISSING: {p}")
        all_ok = False
    else:
        sz = os.path.getsize(full)
        if sz < 1000:
            print(f"TOO SMALL: {p} ({sz} bytes)")
            all_ok = False

if all_ok:
    print(f"ALL {len(paths)} GALLERY PHOTOS EXIST AND ARE HEALTHY!")
