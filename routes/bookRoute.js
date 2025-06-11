const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const books = require('../models/book');
const booksCtrl = require('../controllers/bookControler');
const {upload,resizeImage} = require('../middleware/multer-config');



router.post('/',auth,upload,resizeImage,booksCtrl.createbooks);

router.get('/bestrating', booksCtrl.getTopRatedBooks);

router.get('/:id',booksCtrl.getOneBook);

router.get('/' ,booksCtrl.getAllBooks);

router.put('/:id',auth,upload,resizeImage,booksCtrl.modifyBooks);

router.delete('/:id',auth,booksCtrl.deleteBooks);

router.post('/:id/rating', auth, booksCtrl.noteBooks);



module.exports = router;