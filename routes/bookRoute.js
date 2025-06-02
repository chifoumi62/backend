const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const booksCtrl = require('../controllers/bookControler');
const book = require('../models/book');

router.post('/',booksCtrl.createbooks);

router.get('/:id',booksCtrl.getOneBook);

router.get('/' ,booksCtrl.getAllBooks);

router.put('/:id',booksCtrl.modifyBooks);

router.delete('/:id',booksCtrl.deleteBooks);
module.exports = router;