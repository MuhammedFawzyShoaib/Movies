const mongoose = require('mongoose');

const PersonRef = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true, index: true }
}, { _id: false });

const MovieSchema = new mongoose.Schema({
  tconst: { type: String, required: true, unique: true, index: true },
  title: {
    primary: { type: String, required: true, index: true },
    original: { type: String }
  },
  type: { type: String, enum: ['movie','short','tvMovie','tvSeries'], index: true },
  isAdult: { type: Boolean, default: false },
  year: {
    start: { type: Number, min: 1870, max: 2100, index: true },
    end: { type: Number, min: 1870, max: 2100 }
  },
  runtimeMinutes: { type: Number, min: 0 },
  genres: [{ type: String, index: true }],
  rating: {
    average10: { type: Number, min: 0, max: 10 },
    percent: { type: Number, min: 0, max: 100, index: true },
    votes: { type: Number, min: 0 }
  },
  crew: {
    directors: [PersonRef],
    writers: [PersonRef],
    actors: [PersonRef]
  },
  links: {
    imdb: { type: String }
  }
}, { timestamps: true });

// helpful compound/text indexes
MovieSchema.index({ 'title.primary': 'text' });
MovieSchema.index({ 'crew.directors.name': 1 });
MovieSchema.index({ 'crew.actors.name': 1 });
MovieSchema.index({ 'rating.percent': -1, 'year.start': -1 });

module.exports = mongoose.model('Movie', MovieSchema, 'movies');
