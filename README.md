🎬 Movie Night Project
📂 Project Structure
Movies-Project/
│
├── server/                # Backend (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── models/        # Mongoose schemas (e.g., Movie.js, Wishlist.js)
│   │   ├── routes/        # Express routes (movieRoutes.js, wishlistRoutes.js)
│   │   ├── controllers/   # Route handlers (movieController.js, wishlistController.js)
│   │   ├── build/         # Scripts for building DB from .tsv/.json
│   │   └── index.js       # Main Express app
│   ├── package.json
│   └── README.md
│
├── movies-app/            # Frontend (React + Vite/CRA)
│   ├── src/
│   │   ├── components/    # UI Components (MovieCard, Wishlist, Navbar, etc.)
│   │   ├── pages/         # Pages (Home.js, WishlistPage.js)
│   │   ├── services/      # API calls (movieService.js, wishlistService.js)
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
└── README.md              # Root documentation (this file)

⚙️ Backend (server)
✅ Current Features

Loads movies from .tsv or .json files into MongoDB.

Exposes REST APIs to fetch movies.

🛠️ What to Add for Wishlist

Model (src/models/Wishlist.js)

const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

module.exports = mongoose.model('Wishlist', wishlistSchema);


Controller (src/controllers/wishlistController.js)

getWishlist(req, res) → return all movies in wishlist

addToWishlist(req, res) → add movie by ID

removeFromWishlist(req, res) → remove movie by ID

Routes (src/routes/wishlistRoutes.js)

const express = require('express');
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const router = express.Router();

router.get('/:userId', getWishlist);
router.post('/:userId/add/:movieId', addToWishlist);
router.delete('/:userId/remove/:movieId', removeFromWishlist);

module.exports = router;


Link routes in backend (src/index.js)

const wishlistRoutes = require('./routes/wishlistRoutes');
app.use('/api/wishlist', wishlistRoutes);

🎨 Frontend (movies-app)
✅ Current Features

Displays movie list.

Calls backend to fetch movies.

🛠️ What to Add for Wishlist

Service Layer (src/services/wishlistService.js)

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/wishlist';

export const getWishlist = (userId) => axios.get(`${API_URL}/${userId}`);
export const addToWishlist = (userId, movieId) => axios.post(`${API_URL}/${userId}/add/${movieId}`);
export const removeFromWishlist = (userId, movieId) => axios.delete(`${API_URL}/${userId}/remove/${movieId}`);


Components to Update

MovieCard.js → Add "Add to Wishlist" button.

Wishlist.js → List of movies in wishlist with "Remove" button.

Pages to Add

WishlistPage.js → Renders <Wishlist /> component and fetches wishlist data from API.

App Navigation (App.js)

import WishlistPage from './pages/WishlistPage';

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/wishlist" element={<WishlistPage />} />
</Routes>

🔗 Linking Frontend & Backend

Start backend:

cd server
npm install
npm start


Default runs at: http://localhost:5000

Start frontend:

cd movies-app
npm install
npm start


Runs at: http://localhost:3000

Configure proxy in movies-app/package.json:

"proxy": "http://localhost:5000"

📌 Remaining Tasks

 Add authentication (basic user login) to make wishlist user-specific.

 Improve movie search/filter on frontend.

 Add pagination for large movie lists.

 Styling/UI improvements.

 Deploy backend (Heroku, Render, etc.) & frontend (Vercel, Netlify).
