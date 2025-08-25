require('dotenv').config();
const { connect } = require('../db');

(async () => {
  const mongoose = await connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;

  console.log('Building movies collection (this may take a while)…');

const pipeline = [
  { $match: { titleType: { $in: ['movie','short','tvMovie','tvSeries'] } } },
  { $project: {
      tconst: 1,
      titleType: 1,
      primaryTitle: 1,
      originalTitle: 1,
      isAdult: { $eq: ['$isAdult', '1'] },
      startYear: { $convert: { input: '$startYear', to: 'int', onError: null, onNull: null } },
      endYear:   { $convert: { input: '$endYear',   to: 'int', onError: null, onNull: null } },
      runtimeMinutes: { $convert: { input: '$runtimeMinutes', to: 'int', onError: null, onNull: null } },
      genres: { $cond: [ { $or: [ { $eq: ['$genres', '\\N'] }, { $not: ['$genres'] } ] }, [], { $split: ['$genres', ','] } ] }
  }},
  // Ratings
  { $lookup: { from: 'title_ratings', localField: 'tconst', foreignField: 'tconst', as: 'rating' } },
  { $unwind: { path: '$rating', preserveNullAndEmptyArrays: true } },
  { $addFields: {
      rating: {
        averageRating: { $convert: { input: '$rating.averageRating', to: 'double', onError: null, onNull: null } },
        numVotes: { $convert: { input: '$rating.numVotes', to: 'int', onError: 0, onNull: 0 } }
      }
  }},
  // Crew
  { $lookup: { from: 'title_crew', localField: 'tconst', foreignField: 'tconst', as: 'crewDoc' } },
  { $unwind: { path: '$crewDoc', preserveNullAndEmptyArrays: true } },
  { $addFields: {
      directorIds: { $cond: [ { $in: ['$crewDoc.directors', [null, '\\N']] }, [], { $split: ['$crewDoc.directors', ','] } ] },
      writerIds:   { $cond: [ { $in: ['$crewDoc.writers',   [null, '\\N']] }, [], { $split: ['$crewDoc.writers',   ','] } ] },
  }},
  { $lookup: {
      from: 'name_basics',
      let: { ids: '$directorIds' },
      pipeline: [ { $match: { $expr: { $in: ['$nconst', '$$ids'] } } }, { $project: { _id:0, id:'$nconst', name:'$primaryName' } } ],
      as: 'directors'
  }},
  { $lookup: {
      from: 'name_basics',
      let: { ids: '$writerIds' },
      pipeline: [ { $match: { $expr: { $in: ['$nconst', '$$ids'] } } }, { $project: { _id:0, id:'$nconst', name:'$primaryName' } } ],
      as: 'writers'
  }},
  // Principals & Actors
  { $lookup: { from: 'title_principals', localField: 'tconst', foreignField: 'tconst', as: 'principals' } },
  { $addFields: {
      actorIds: { $map: { input: { $filter: { input: '$principals', as: 'p', cond: { $in: ['$$p.category', ['actor','actress']] } } }, as: 'p', in: '$$p.nconst' } }
  }},
  { $lookup: {
      from: 'name_basics',
      let: { ids: '$actorIds' },
      pipeline: [
        { $match: { $expr: { $in: ['$nconst', '$$ids'] } } },
        { $project: { _id:0, id:'$nconst', name:'$primaryName' } },
        { $limit: 30 }
      ],
      as: 'actors'
  }},
  // Final projection
  { $project: {
      _id: 0,
      tconst: 1,
      title: { primary: '$primaryTitle', original: '$originalTitle' },
      type: '$titleType',
      isAdult: 1,
      year: { start: '$startYear', end: '$endYear' },
      runtimeMinutes: 1,
      genres: 1,
      rating: {
        average10: { $ifNull: ['$rating.averageRating', null] },
        percent: { $cond: [ { $ifNull: ['$rating.averageRating', false] }, { $round: [{ $multiply: ['$rating.averageRating', 10] }, 1] }, null ] },
        votes: { $ifNull: ['$rating.numVotes', 0] }
      },
      crew: { directors: '$directors', writers: '$writers', actors: '$actors' },
      links: { imdb: { $concat: ['https://www.imdb.com/title/', '$tconst', '/'] } }
  }},
  { $merge: { into: 'movies', on: 'tconst', whenMatched: 'replace', whenNotMatched: 'insert' } }
];


  await db.collection('title_basics').aggregate(pipeline, { allowDiskUse: true }).toArray();

  // Ensure indexes (if not created by Mongoose yet)
  await db.collection('movies').createIndexes([
    { key: { 'title.primary': 'text' }, name: 'title_text' },
    { key: { 'year.start': 1 }, name: 'year_start_1' },
    { key: { genres: 1 }, name: 'genres_1' },
    { key: { 'rating.percent': -1 }, name: 'rating_percent_-1' },
    { key: { 'crew.directors.name': 1 }, name: 'directors_name_1' },
    { key: { 'crew.actors.name': 1 }, name: 'actors_name_1' },
    { key: { type: 1 }, name: 'type_1' }
  ]);

  console.log('movies collection built + indexed.');
  process.exit(0);
})();
