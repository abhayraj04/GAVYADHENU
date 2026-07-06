Place product images here using the filenames referenced in `server/data/seed.js`.

Required filenames (example):
- ghee.jpg
- groundnut_oil.jpg
- honey.jpg
- wheat_flour.jpg
- sattu_powder.jpg
- makhana.jpg
- chyawanprash.jpg
- immunity_combo.jpg
- immunity_tea.jpg
- red_chilli.jpg

After adding your images, run the seed script to populate the DB with these image paths.
Example commands:

```
cd server
node data/seed.js
```

Make sure your server is started so the images are served at `http://localhost:5000/uploads/products/<filename>`.
