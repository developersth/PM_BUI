const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documents');

router.get('/', documentsController.index)
router.post('/', documentsController.store)
router.put('/:id', documentsController.update)
router.delete('/:id', documentsController.destroy)

module.exports = router;