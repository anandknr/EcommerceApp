const express = require('express');
const app = new express();

const morgan = require('morgan');
const mongoose = require('mongoose');

const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());

const api = process.env.API_URL;

const productRouter = require('./routers/products');
const categoryRouter = require('./routers/categories');
const orderRouter = require('./routers/orders');
const userRouter = require('./routers/users');

app.use(api + "/products", productRouter);
app.use(api + "/categories", categoryRouter);
app.use(api + "/orders", orderRouter);
app.use(api + "/users", userRouter);

mongoose.set('strictQuery', true);

mongoose.connect(process.env.CONNECTION_STRING, { dbName: 'eshop-db' })
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log(err);
    });

app.get('/', async(req, res) => {

    res.status(200).send("hello world " + Math.random());
})

app.listen(3000, () => {
    console.log("hello world" + api);
});