const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();

router.get('/', async(req, res) => {
    let productList = await Product.find().populate("category");
    res.send(productList);
});

router.get('/:id', async(req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404).send({ success: false, message: "product not found" });
    }
    res.send(product);
});

router.post('/', async(req, res) => {

    let category = await Category.findById(req.body.category);

    if (!category) {
        res.status(400).send('Invalid Category');
    }
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });
    product = await product.save();

    if (!product) {
        res.status(500).send('The product cannot be created');
    }

    res.status(200).send(product);


    // let outObj = req.body;
    // res.send(outObj);
});

router.put("/:id", async(req, res) => {

    let category = await Category.findById(req.body.category);

    if (!category) {
        res.status(400).send('Invalid Category');
    }

    let product = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
    }, { new: true });

    if (!product) {
        res.status(404).send({ success: false, message: "product cannot be updated" });
    }

    res.status(200).send(product);

});

module.exports = router;