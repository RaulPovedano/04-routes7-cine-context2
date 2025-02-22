import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movieId: {
        type: Number,
        required: true
    },
    title: String,
    poster_path: String,
    vote_average: Number,
    release_date: String
}, {
    timestamps: true
});

export default mongoose.model('Favorite', favoriteSchema);