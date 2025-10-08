import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema({
  mal_id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  title_english: String,
  title_japanese: String,
  image_url: { type: String, required: true },
  trailer_url: String,
  synopsis: String,
  type: String,
  episodes: Number,
  status: String,
  airing: Boolean,
  aired: {
    from: Date,
    to: Date,
  },
  duration: String,
  rating: String,
  score: Number,
  scored_by: Number,
  rank: Number,
  popularity: Number,
  members: Number,
  favorites: Number,
  favorited_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  genres: [{
    name: String,
  }],
  studios: [{
    name: String,
  }],
}, {
  timestamps: true,
});

// Create indexes for better search performance
animeSchema.index({ title: 'text', synopsis: 'text' });
animeSchema.index({ popularity: -1 });
animeSchema.index({ score: -1 });
animeSchema.index({ mal_id: 1 });

export const AnimeModel = mongoose.model('Anime', animeSchema);