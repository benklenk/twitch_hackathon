const mongoose = require('mongoose');

const mergedSchema = mongoose.Schema({
    ARTIST_NAME: String,
    ARTIST_ID: Number,
    TOTAL_TRACKS: Number,
    GENRE_ID: Number,
    GENRE_NAME: String
} {collection: 'merged'});

const genres = mongoose.model('merged', genresSchema, 'merged');

module.exports = {
    merged: merged
};
