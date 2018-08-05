const mongoose = require('mongoose');

const genresSchema = mongoose.Schema({
    GENRE_ID: Number,
    GENRE_NAME: String
} {collection: 'genres'});

const genres = mongoose.model('genres', genresSchema, 'genres');

module.exports = {
    genres: genres
};
