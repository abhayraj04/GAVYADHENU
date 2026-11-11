import os
import re

all_imgs = set()
for root, dirs, files in os.walk('client/src'):
    for f in files:
        if f.endswith(('.tsx', '.ts', '.css')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
                matches = re.findall(r'["\'](/[^"\']+\.(?:jpg|jpeg|png|svg|webp))["\']', content)
                for m in matches:
                    all_imgs.add((m, path))

print(f"Total /image references across client/src: {len(all_imgs)}")
missing = []
for ref, filepath in sorted(all_imgs):
    rel = ref.lstrip('/')
    disk_path = os.path.join('client/public', rel)
    if not os.path.exists(disk_path):
        print(f"MISSING: {ref} referenced in {filepath}")
        missing.append((ref, filepath))

if not missing:
    print("\nALL image references in client/src exist on disk!")
else:
    print(f"\n{len(missing)} image references are missing!")
