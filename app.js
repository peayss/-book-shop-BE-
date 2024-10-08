// dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();


app.listen(process.env.PORT);

const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const categoryRouter = require('./routes/category');
const ordersRouter = require('./routes/orders');
const cartsRouter = require('./routes/carts');
const likesRouter = require('./routes/likes');

app.use("/users", usersRouter);
app.use("/books", booksRouter);
app.use("/category", categoryRouter);
app.use("/orders", ordersRouter);
app.use("/likes", likesRouter);
app.use("/carts", cartsRouter);


