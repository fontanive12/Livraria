const cors = require('cors');
const router = require('express').Router();
const users = require('./users');
const categories = require('./categories');
const states = require('./states');
const cities = require('./cities');
const publishers = require('./publishers');
const books = require('./books');
const logs = require('./logs');

router.use(cors());

router.use(users);
router.use(categories);
router.use(states);
router.use(cities);
router.use(publishers);
router.use(books);
router.use(logs);

module.exports = router;