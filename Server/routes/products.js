const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../middleware/upload');

const base = process.env.BASE_URL;

// READ ALL
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post(
  '/',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'itemImages', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { name, description, category, items } = req.body;

      if (!name || !description || !req.files?.mainImage) {
        return res.status(400).json({ error: 'Name, description, and main image are required.' });
      }
      if (!items) {
        return res.status(400).json({ error: 'At least one item is required.' });
      }

      let parsedItems;
      try {
        parsedItems = JSON.parse(items);
      } catch {
        return res.status(400).json({ error: 'Invalid items format.' });
      }

      const itemImageFiles = req.files.itemImages || [];
      if (itemImageFiles.length !== parsedItems.length) {
        return res.status(400).json({ error: 'Each item needs exactly one image.' });
      }

      const itemsWithImages = parsedItems.map((item, i) => ({
        brand: item.brand,
        name: item.name,
        price: Number(item.price),
        buyUrl: item.buyUrl,
        image: `${base}/uploads/${itemImageFiles[i].filename}`,
      }));

      const product = new Product({
        name,
        description,
        category,
        mainImage: `${base}/uploads/${req.files.mainImage[0].filename}`,
        items: itemsWithImages,
      });

      const saved = await product.save();
      res.status(201).json(saved);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;