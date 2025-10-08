import express from 'express';
import { verifyToken } from '../middleware/auth';
import { AnimeModel } from '../models/Anime';

const router = express.Router();

// Get all anime with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const anime = await AnimeModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ popularity: -1 });

    const total = await AnimeModel.countDocuments();

    res.json({
      anime,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAnime: total,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get trending anime
router.get('/trending', async (req, res) => {
  try {
    const trending = await AnimeModel.find()
      .sort({ popularity: -1 })
      .limit(10);
    res.json(trending);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Search anime
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    const anime = await AnimeModel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { synopsis: { $regex: query, $options: 'i' } },
      ],
    }).limit(20);
    res.json(anime);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's favorite anime
router.get('/favorites', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await AnimeModel.find({ favorited_by: userId });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle favorite anime
router.post('/favorites/:id', verifyToken, async (req, res) => {
  try {
    const animeId = req.params.id;
    const userId = req.user.id;
    const anime = await AnimeModel.findById(animeId);

    if (!anime) {
      return res.status(404).json({ error: 'Anime not found' });
    }

    const isFavorited = anime.favorited_by.includes(userId);
    if (isFavorited) {
      anime.favorited_by = anime.favorited_by.filter((id) => id !== userId);
    } else {
      anime.favorited_by.push(userId);
    }

    await anime.save();
    res.json({ isFavorited: !isFavorited });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export const animeRouter = router;