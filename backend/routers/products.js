const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();

router.get('/', async(req, res) => {
    let productList = await Product.find();
    res.send(productList);
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

module.exports = router;