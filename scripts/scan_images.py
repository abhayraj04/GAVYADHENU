import os
import re

img_refs = set()
for root, dirs, files in os.walk('client/src'):
    for f in files:
        if f.endswith(('.tsx', '.ts', '.css')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
                matches = re.findall(r'["\'](/products/[^"\']+\.(?:jpg|png|svg|webp))["\']', content)
                for m in matches:
                    img_refs.add(m)

with open('server/db.ts', 'r', encoding='utf-8') as fp:
    content = fp.read()
    matches = re.findall(r'["\'](/products/[^"\']+\.(?:jpg|png|svg|webp))["\']', content)
    for m in matches:
        img_refs.add(m)

print(f"Total image references found: {len(img_refs)}")
missing = []
for ref in sorted(img_refs):
    rel = ref.lstrip('/')
    disk_path = os.path.join('client/public', rel)
    if not os.path.exists(disk_path):
        print(f"MISSING: {ref}")
        missing.append(ref)
    else:
        size = os.path.getsize(disk_path)
        print(f"OK: {ref} ({size} bytes)")

if not missing:
    print("\nALL referenced product images exist on disk!")
else:
    print(f"\n{len(missing)} images are MISSING!")
