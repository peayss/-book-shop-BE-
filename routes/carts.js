const express = require('express');
const router = express.Router();
router.use(express.json())

//장바구니 담기
router.post('/', (req, res) => {
    res.json('장바구니 담기');
})

//장바구니 조회
router.get('/', (req, res) => {
    res.json('장바구니 조회');
})

//장바구니 도서 삭제
router.delete('/:id', (req, res) => {
    res.json('장바구니 삭제');
})

// //장바구니에서 선택한 / 체크표시가 된 주문 상품 목록 조회 (주문서 작성 page)
// router.get('/', (req, res) => {
//     res.json('장바구니 선택 상품 조회');
// })

module.exports = router;