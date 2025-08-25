const Movie = require('../models/Movie');

const PAGE_SIZE = parseInt(process.env.PAGE_SIZE || '24', 10);

function escReg(s='') { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

exports.list = async (req, res) => {
  try {
    const {
      page = 1,
      q,
      title,
      year,
      yearFrom,
      yearTo,
      genre,
      type,
      minRating,
      maxRating,
      director,
      actor,
      sort
    } = req.query;

    const filter = {};

    // title search (regex, case-insensitive). If q present, use it.
    if (q) filter['title.primary'] = new RegExp(escReg(q), 'i');
    if (title && !q) filter['title.primary'] = new RegExp(escReg(title), 'i');

    // year filtering
    if (year) filter['year.start'] = parseInt(year);
    if (yearFrom || yearTo) {
      filter['year.start'] = {};
      if (yearFrom) filter['year.start'].$gte = parseInt(yearFrom);
      if (yearTo)   filter['year.start'].$lte = parseInt(yearTo);
    }

    // enums / lists
    if (type) filter.type = type;
    if (genre) {
      // support comma-separated list: genre=Action,Sci-Fi
      filter.genres = { $in: String(genre).split(',').map(s => s.trim()) };
    }

    // rating in percent (0..100)
    if (minRating || maxRating) {
      filter['rating.percent'] = {};
      if (minRating) filter['rating.percent'].$gte = parseFloat(minRating);
      if (maxRating) filter['rating.percent'].$lte = parseFloat(maxRating);
    }

    if (director) filter['crew.directors.name'] = new RegExp(escReg(director), 'i');
    if (actor)    filter['crew.actors.name']    = new RegExp(escReg(actor), 'i');

    // sorting
    const sortMap = {
      'rating_desc': { 'rating.percent': -1 },
      'rating_asc' : { 'rating.percent':  1 },
      'year_desc'  : { 'year.start': -1 },
      'year_asc'   : { 'year.start':  1 },
      'title_asc'  : { 'title.primary': 1 },
      'title_desc' : { 'title.primary': -1 }
    };
    const sortSpec = sortMap[sort] || { 'rating.percent': -1, 'year.start': -1 };

    const p = Math.max(parseInt(page) || 1, 1);
    const skip = (p - 1) * PAGE_SIZE;

    const [total, items] = await Promise.all([
      Movie.countDocuments(filter),
      Movie.find(filter)
           .sort(sortSpec)
           .skip(skip)
           .limit(PAGE_SIZE)
           .lean()
           .select('-_id')
    ]);

    res.json({ page: p, pageSize: PAGE_SIZE, totalPages: Math.ceil(total / PAGE_SIZE), totalItems: total, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.tconst;
    const doc = await Movie.findOne({ tconst: id }).lean().select('-_id');
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
