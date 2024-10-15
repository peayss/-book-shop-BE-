//const conn = require("../mariadb"); //db 모듈
const mariadb = require("mysql2/promise");
const { StatusCodes } = require("http-status-codes"); //status code 모듈

const order = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "BookShop",
    dataStrings: true,
  });

  const {
    items,
    delivery,
    total_quantity,
    total_price,
    user_id,
    firstBookTitle,
  } = req.body;

  // delivery 테이블 삽입
  let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?,?,?)`;
  let values = [delivery.address, delivery.receiver, delivery.contact];
  let [results] = await conn.execute(sql, values);
  let delivery_id = results.insertId;

  // orders 테이블 삽입
  sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`;
  values = [firstBookTitle, total_quantity, total_price, user_id, delivery_id];
  [results] = await conn.execute(sql, values);
  let order_id = results.insertId;

  // items를 가지고 장바구니에서 book_id, quantity 조회
  sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
  let [orderItems, fields] = await conn.query(sql, [items]);

  // orderedBook 테이블 삽입
  sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
  values = [];
  orderItems.forEach((item) => {
    values.push([order_id, item.book_id, item.quantity]);
  });
  results = await conn.query(sql, [values]);

  // 장바구니 상품 삭제
  let result = await deleteCartItems(conn, items);

  return res.status(StatusCodes.OK).json(result);
};

const deleteCartItems = async (conn, items) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`;
  let results = await conn.query(sql, [items]);
  return results;
}

const getOrders = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "BookShop",
    dataStrings: true,
  });

  let sql = `SELECT orders.id, created_at, book_title, total_price, total_quantity,
            address, receiver, contact
            FROM orders LEFT JOIN delivery 
            ON orders.delivery_id = delivery.id;`
  let [rows, fields] = await conn.query(sql);
  return res.status(StatusCodes.OK).json(rows);
};

const getOrdersDetail = async (req, res) => {
  const {id} = req.params;
  const conn = await mariadb.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "BookShop",
    dataStrings: true,
  });

  let sql = `SELECT book_id, title, author, price, quantity
            FROM orderedBook LEFT JOIN books 
            ON orderedBook.book_id = books.id
            WHERE order_id = ?`;
  let [rows, fields] = await conn.query(sql, [id]);
  return res.status(StatusCodes.OK).json(rows);
};

module.exports = {
  order,
  getOrders,
  getOrdersDetail,
};
