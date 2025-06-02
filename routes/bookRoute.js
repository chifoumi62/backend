const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const books = require('../models/book');
const booksCtrl = require('../controllers/bookControler');


router.post('/',auth,booksCtrl.createbooks);

router.get('/:id',booksCtrl.getOneBook);

router.get('/' ,booksCtrl.getAllBooks);

router.put('/:id',auth,booksCtrl.modifyBooks);

router.delete('/:id',auth,booksCtrl.deleteBooks);
module.exports = router;