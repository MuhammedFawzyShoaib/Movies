const express = require('express');
const ctrl = require('../controllers/movies.controller');
const router = express.Router();

router.get('/movies', ctrl.list);                // list with filters + pagination (24/page)
router.get('/movies/:tconst', ctrl.getById);     // details by IMDb id

module.exports = router;
