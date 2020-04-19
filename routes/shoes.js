const express = require('express')
const router = express.Router()

const shoesController = require('../controllers/shoeController')
const upload = require('../middleware/upload')

router.get('/', shoesController.showAll)
router.get('/theKind', shoesController.showTheKind)
router.post('/show', shoesController.showOne)
router.post('/add', upload.single('avatar'), shoesController.add)
    // router.post('/add', shoesController.add)
router.post('/update/:_id', shoesController.update)
router.get('/delete/:_id', shoesController.deleteOne)

module.exports = router