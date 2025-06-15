const Book = require('../models/book');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const user = require('../models/user');

exports.createbooks=(req, res, next) => {
   
const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
    delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/resized_${req.file.filename}`,
    userId: req.auth.userId
  });
  book.save().then(
    () => {
      res.status(201).json({
        message: 'Objet enregistré !'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneBook =  (req, res, next) => {
  Book.findOne({
    _id: req.params.id
  }).then(
    (book) => {
      res.status(200).json(book);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.getAllBooks = (req,res,next) => {
  Book.find().then(
    (books) => {
      res.status(200).json(books);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.modifyBooks =  (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/resized_${req.file.filename}`
    } : { ...req.body };
    delete bookObject._userId;
    Book.findOne({ _id: req.params.id }).then(
        (book) => {
        if (book.userId !== req.auth.userId) {
            return res.status(401).json({
            message: 'Non autorisé !'
            });
        }
        if (req.file) {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id }).then(
                () => {
                res.status(200).json({
                    message: 'Objet modifié !'
                });
                }
            ).catch(
                (error) => {
                res.status(401).json({
                    error: error
                });
                }
            );  
            }
            ); 
      } else {
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id }).then(
            () => {
            res.status(200).json({
                message: 'Objet modifié !'
            });
            }
        ).catch(
            (error) => {
            res.status(401).json({
                error: error
            });
            }
        );
      }
    }
    ).catch( 
        (error) => {
        res.status(400).json({
            error: error
        });
        }
    );
};


        
       

exports.deleteBooks = (req, res, next) => {
    Book.findOne({ _id: req.params.id }).then(
        (book) => {
        if (book.userId !== req.auth.userId) {
            return res.status(401).json({
            message: 'Non autorisé !'
            });
        }else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Book.deleteOne({ _id: req.params.id }).then(
            () => {
                res.status(200).json({
                message: 'Objet supprimé !'
                });
            }
            ).catch(
            (error) => {
                res.status(401).json({
                error: error
                });
            }
            );
        });
        }
    }
    ).catch(
        (error) => {
        res.status(400).json({
            error: error
        });
        }
    );
}; 

exports.noteBooks = async (req, res, next) => {

const {rating} = req.body;
if (!rating || typeof rating !== 'number' || rating < 0 || rating > 5) {
    return res.status(400).json({ error: 'Invalid rating. It must be a number between 0 and 5.' });
}
try {
    const book = await Book.findById(req.params.id);
    if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    // Check if the user has already rated this book
    const existingRating = book.ratings.find(r => r.userId === req.auth.userId);
    if (existingRating) {
        return res.status(403).json({ error: 'You have already rated this book.' });
    }

    // Add the new rating
    book.ratings.push({ userId: req.auth.userId, grade: rating, });
    
    // Calculate the new average rating
    const totalRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
    book.averageRating = totalRatings / book.ratings.length;

    await book.save();
    
    res.status(200).json({
        message: 'Rating added successfully',
        ...book.toObject(),
        averageRating: book.averageRating,
         
    });
} catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ error: 'An error occurred while adding the rating.' });
}
};

exports.getTopRatedBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching top-rated books:', error);
    res.status(404).json({ error: 'An error occurred while fetching top-rated books.' });
  }
};

