'use strict';
const router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use((req, res) => res.status(404).end());
