import urllib.request

urls = [
    'http://localhost:3000/products/bilona-a2-ghee.jpg',
    'http://localhost:3000/products/bilona-a2-ghee-texture.jpg',
    'http://localhost:3000/products/bilona-a2-ghee-back.jpg',
    'http://localhost:3000/products/bilona-a2-ghee-churn.jpg',
    'http://localhost:3000/products/lakadong-turmeric-front.jpg',
    'http://localhost:3000/products/lakadong-turmeric-side.jpg',
    'http://localhost:3000/products/lakadong-turmeric-back.jpg',
    'http://localhost:3000/products/lakadong-turmeric-farm.jpg',
    'http://localhost:3000/products/teja-chilli-front.jpg',
    'http://localhost:3000/products/teja-chilli-side.jpg',
    'http://localhost:3000/products/teja-chilli-back.jpg',
    'http://localhost:3000/products/teja-chilli-texture.jpg',
    'http://localhost:3000/products/black-turmeric-front.jpg',
    'http://localhost:3000/products/black-turmeric-angle.jpg',
    'http://localhost:3000/products/black-turmeric-back.jpg',
    'http://localhost:3000/products/black-turmeric-rhizome.jpg',
    'http://localhost:3000/products/coriander-powder-front.jpg',
    'http://localhost:3000/products/coriander-powder-back.jpg',
    'http://localhost:3000/products/coriander-powder-seeds.jpg',
    'http://localhost:3000/products/coriander-powder-curry.jpg',
    'http://localhost:3000/products/yellow-mustard-oil.jpg',
    'http://localhost:3000/products/yellow-mustard-oil-pour.jpg',
    'http://localhost:3000/products/yellow-mustard-oil-back.jpg',
    'http://localhost:3000/products/yellow-mustard-oil-seeds.jpg',
    'http://localhost:3000/products/groundnut-oil.jpg',
    'http://localhost:3000/products/groundnut-oil-pour.jpg',
    'http://localhost:3000/products/groundnut-oil-back.jpg',
    'http://localhost:3000/products/groundnut-oil-peanuts.jpg',
    'http://localhost:3000/products/wildflower-honey.jpg',
    'http://localhost:3000/products/farmstead-makhana.jpg',
    'http://localhost:3000/products/sattu-powder.jpg',
    'http://localhost:3000/products/mp-sharbati-wheat-flour.jpg',
    'http://localhost:3000/products/quiet-morning-brew.jpg',
    'http://localhost:3000/products/earthen-candle.jpg',
    'http://localhost:3000/products/the-living-gift-box.jpg',
    'http://localhost:3000/products/wood-ash-cleaner.jpg',
    'http://localhost:3000/products/coconut-scrubber.jpg',
    'http://localhost:3000/products/pashu-starter-pack.jpg',
]

failed = 0
for u in urls:
    try:
        req = urllib.request.Request(u, method='HEAD')
        with urllib.request.urlopen(req, timeout=3) as resp:
            ct = resp.headers.get('Content-Type')
            cl = resp.headers.get('Content-Length')
            name = u.split('/')[-1]
            if resp.status == 200:
                print(f"HTTP 200 OK: {name:<35} ({cl} bytes, {ct})")
            else:
                print(f"FAILED {resp.status}: {u}")
                failed += 1
    except Exception as e:
        print(f"ERROR: {u} -> {e}")
        failed += 1

print(f"\nHTTP Verification summary: {len(urls) - failed}/{len(urls)} succeeded!")
