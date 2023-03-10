const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async(req, res) => {
    filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(",") }
        console.log(filter);
    }
    let productList = await Product.find(filter).populate("category");
    res.send(productList);
});

router.get('/:id', async(req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404).send({ success: false, message: "product not found" });
    }
    res.send(product);
});

router.get('/get/featured/:limit?', async(req, res) => {
    var count = req.params.limit ? req.params.limit : 0;
    let product = await Product.find({ isFeatured: true }).limit(+count).select(["name", "isFeatured"]);
    if (!product) {
        res.status(404).send({ success: false, message: "product not found" });
    }
    res.send(product);
});

router.get('/get/count', async(req, res) => {
    console.log("bbb");
    const productCount = await Product.countDocuments();
    console.log("hhh");
    if (!productCount) {
        res.status(404).send({ success: false, message: "product count not found" });
    }
    res.send({ productCount: productCount });
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

    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid object ID');
    }

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

router.delete('/:id', async(req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ success: true, message: 'the product deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'product not deleted' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
})

module.exports = router;