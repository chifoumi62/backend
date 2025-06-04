const mongoose=require('mongoose');

const bookSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [{
        userId: { type: String, required: true },
        grade: { type: Number, required: true }
    }],
    averageRating: { type: Number, default: 0 },
    userId: { type: String, required: true }
   
  });

  //virtuel pour moyenne des notes
    bookSchema.virtual('moyenne').get(function() {
    if (this.ratings.length === 0) return 0;
    const total = this.ratings.reduce((sum, grade) => sum + grade.value, 0);
    return total / this.ratings.length;
  });

  bookSchema.set ('toJSON', { virtuals: true });
  
  module.exports = mongoose.model('Book', bookSchema);

  