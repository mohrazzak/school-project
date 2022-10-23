const express = require(`express`);

const editController = require(`../controllers/edit-models`);

const router = express.Router();

router.post(`/editPassword`, editController.editPassword);

module.exports = router;
