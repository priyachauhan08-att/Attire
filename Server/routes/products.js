const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../middleware/upload');

// TRENDING — must come BEFORE /:id routes, or "trending" gets treated as an id
router.get('/trending/viewed', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const products = await Product.find().sort({ views: -1 }).limit(limit);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/trending/clicked', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const products = await Product.find().sort({ clicks: -1 }).limit(limit);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

// TRACK A VIEW (fires when someone opens a product page)
router.patch('/:id/view', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ views: product.views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TRACK A CLICK (fires when someone clicks a "Shop item" buy link)
router.patch('/:id/click', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ clicks: product.clicks });
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
        image: itemImageFiles[i].path, // Cloudinary URL (was: `${base}/uploads/${itemImageFiles[i].filename}`)
      }));

      const product = new Product({
        name,
        description,
        category,
        mainImage: req.files.mainImage[0].path, // Cloudinary URL (was: `${base}/uploads/${req.files.mainImage[0].filename}`)
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