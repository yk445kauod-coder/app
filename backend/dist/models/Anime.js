"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimeModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const animeSchema = new mongoose_1.default.Schema({
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
    favorited_by: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
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
exports.AnimeModel = mongoose_1.default.model('Anime', animeSchema);
