const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async(req, res) => {
    const userList = await User.find();

    if (!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList);
});

router.get(`/:id`, async(req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
        res.status(500).json({ success: false, message: 'no user found' })
    }
    res.status(200).send(user);
})


router.post('/', async(req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });
    user = await user.save();
    if (!user) {
        return res.status(404).send('the user cannot be created');
    }

    res.send(user);
});

router.put('/:id', async(req, res) => {
    newPasswordHash = "";
    if (req.body.password) {
        newPasswordHash = bcrypt.hashSync(req.body.password);
    } else {
        const currentUser = await User.findById(req.params.id);
        newPasswordHash = currentUser.passwordHash;
    }
    let user = await User.findByIdAndUpdate(
        req.params.id, {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPasswordHash,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        }, { new: true }
    )

    user = await user.save();
    if (!user) {
        return res.status(404).send('the user cannot be updated');
    }

    res.send(user);

});

router.post('/login', async(req, res) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        res.status(400).json("unable to find user");
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {


        let jwtToken = jwt.sign({
            userId: user.id
        }, process.env.SECRET, {
            expiresIn: '1d'
        });

        res.status(200).send({ user: user.email, token: jwtToken });
    } else {
        res.status(400).send("wrong password");
    }

});

module.exports = router;