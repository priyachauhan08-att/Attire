// migrate-to-cloudinary.js
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cloudinary = require('./config/cloudinary'); // adjust path if different
const Product = require('./models/Product');

const UPLOADS_DIR = path.join(__dirname, 'uploads'); // adjust if your uploads folder lives elsewhere

// Extracts the filename from a URL like http://localhost:3000/uploads/12345-file.jpg
function getFilename(url) {
  if (!url) return null;
  return url.split('/uploads/')[1] || null;
}

async function uploadIfLocal(url) {
  // Skip anything that's already a Cloudinary URL (already migrated)
  if (!url || url.includes('res.cloudinary.com')) return url;

  const filename = getFilename(url);
  if (!filename) {
    console.warn(`Could not parse filename from: ${url}`);
    return url;
  }

  const localPath = path.join(UPLOADS_DIR, filename);
  if (!fs.existsSync(localPath)) {
    console.warn(`File not found on disk, skipping: ${localPath}`);
    return url; // leave as-is, can't migrate what isn't there
  }

  const result = await cloudinary.uploader.upload(localPath, {
    folder: 'attire-uploads',
  });
  console.log(`Uploaded ${filename} -> ${result.secure_url}`);
  return result.secure_url;
}

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const products = await Product.find();
  console.log(`Found ${products.length} products to check`);

  for (const product of products) {
    let changed = false;

    const newMainImage = await uploadIfLocal(product.mainImage);
    if (newMainImage !== product.mainImage) {
      product.mainImage = newMainImage;
      changed = true;
    }

    for (const item of product.items) {
      const newItemImage = await uploadIfLocal(item.image);
      if (newItemImage !== item.image) {
        item.image = newItemImage;
        changed = true;
      }
    }

    if (changed) {
      await product.save();
      console.log(`Updated product: ${product.name}`);
    }
  }

  console.log('Migration complete.');
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});