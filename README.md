---

markdown
# 🎬 Movie Night - Full Stack Project

A full-stack web application to explore movies using IMDb datasets, add movies to a **wishlist**, and manage your personalized collection.  
This project consists of a **backend (Node.js + Express + MongoDB)** and a **frontend (React)**.

---

## 📂 Project Structure


Movies/
│── server/              # Backend (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── models/      # MongoDB models (Movie.js, Wishlist.js)
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Request handlers
│   │   ├── build/       # IMDb dataset parsing
│   │   └── index.js     # Entry point
│   ├── package.json
│
│── client/              # Frontend (React)
│   ├── src/
│   │   ├── components/  # React components (MovieList, Wishlist, Navbar, etc.)
│   │   ├── pages/       # React pages
│   │   ├── App.js       # Main React app
│   │   └── index.js     # React entry point
│   ├── public/
│   ├── package.json
│
└── README.md


---

## ⚙ Backend Setup (Server)

1. Navigate to the server folder:
   bash
   cd server
   npm install
   

2. Create a `.env` file:
   env
   MONGO_URI=mongodb://localhost:27017/movies
   PORT=5000
   

3. Run the backend:
   bash
   npm start
   

### API Endpoints

#### 🎥 Movies
- `GET /api/movies` → Fetch all movies  
- `GET /api/movies/:id` → Get details of a movie  

#### ⭐ Wishlist
- `GET /api/wishlist` → Get all movies in wishlist  
- `POST /api/wishlist/:movieId` → Add a movie to wishlist  
- `DELETE /api/wishlist/:movieId` → Remove a movie from wishlist  

📸 Example Screenshot:
![API Testing in Postman](./screenshots/api-postman.png)

---

## 🎨 Frontend Setup (Client)

1. Navigate to client folder:
   bash
   cd client
   npm install
   

2. Run React app:
   bash
   npm start
   

3. Update API base URL in `client/src/utils/api.js`:
   javascript
   const API_BASE = "http://localhost:5000/api";
   

---

## 📌 Frontend Components

- **MovieList.js** → Displays movies fetched from backend  
- **MovieCard.js** → Single movie with "Add to Wishlist" button  
- **Wishlist.js** → Shows saved wishlist, with remove option  
- **Navbar.js** → Navigation between Movies and Wishlist  

📸 Example Screenshots:  
- Home Page:  
  ![Movies Page](./screenshots/movies-page.png)  

- Wishlist Page:  
  ![Wishlist Page](./screenshots/wishlist-page.png)  

---

## 🚀 How to Link Backend with Frontend

1. Start **backend**:
   bash
   cd server
   npm start
   

2. Start **frontend**:
   bash
   cd client
   npm start
   

3. The frontend (React) makes requests to `http://localhost:5000/api`.

---

## 🛠 Features Implemented

- ✅ Import IMDb dataset into MongoDB  
- ✅ REST APIs for movies and wishlist  
- ✅ React frontend with movies and wishlist pages  

---

## 🗂 Next Steps (To-Do)

- 🔍 Add **search** functionality for movies  
- 📊 Add **pagination** for better performance  
- 🎭 Add **genres and ratings filter**  
- 👤 Add **user authentication (JWT)** so wishlist is personal  
- 🌍 Deploy on **Heroku (backend)** + **Netlify/Vercel (frontend)**  

---

## 👨‍💻 Contributing

1. Fork the repo  
2. Create a new branch  
   bash
   git checkout -b feature-name
   
3. Commit changes  
   bash
   git commit -m "Added new feature"
   
4. Push branch and create PR  

---

## 📷 Screenshots Folder

Please place all screenshots in the `./screenshots/` folder:  
- `movies-page.png`  
- `wishlist-page.png`  
- `api-postman.png`  

---
