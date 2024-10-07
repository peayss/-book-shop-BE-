const e = require("express");
const conn = require("../mariadb"); //db 모듈
const { StatusCodes } = require("http-status-codes"); //status code 모듈

const allBooks = (req, res) => {
  // (카테고리 별, 신간 여부)전체 도서 조회
  let { category_id, news, limit, currentPage } = req.query;

  // limit : page 당 도서 수
  // currentPage : 현재 몇 페이지
  // offset : limit * (currentPage-1)

  let offset = limit * (currentPage - 1);
  let sql = `SELECT * FROM books `;
  let values = [];
  if (category_id && news) {
    sql += `WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    values = [category_id];
  } else if (category_id) {
    sql += `WHERE category_id=?`;
    values = [category_id];
  } else if (news) {
    sql += `WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
  }
  sql +=  ` LIMIT ? OFFSET ?`;
  values.push(parseInt(limit), offset);

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results.length) {
      res.status(StatusCodes.OK).json(results);
    } else return res.status(StatusCodes.NOT_FOUND).end();
  });
};

const bookDetail = (req, res) => {
  //개별 도서 조회
  let { id } = req.params;

  let sql = `SELECT * FROM books LEFT JOIN category 
            ON books.category_id = category.id WHERE books.id=?`;
  conn.query(sql, id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results[0]) {
      res.status(StatusCodes.OK).json(results[0]);
    } else return res.status(StatusCodes.NOT_FOUND).end();
  });
};

module.exports = {
  allBooks,
  bookDetail,
};
