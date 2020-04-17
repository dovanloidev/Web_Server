const express = require('express');
const router = express.Router();

const controller = require('../controllers/controller');
const upload = require('../middleware/upload');


router.get('/register', controller.register);
router.get('/login', controller.login);

router.post('/err', controller.err);

router.get('/', controller.index);
router.post('/', upload.single('avatar'), controller.createIndex);

// router.get('/showShoes/:_id/:idTheLoai', controller.editShoesById);
router.get('/showShoes/:_id', controller.editShoesById);
router.post('/editShoes/:_id', upload.single('avatar'), controller.editShoes);
router.get('/deleteShoes/:_id', controller.deleteShoes);
router.get('/shoes', controller.shoes);

router.get('/thekind', controller.thekind);
router.post('/thekind', controller.createTheKind);
router.post('/updatethekind/:_id', controller.updateTheKind);
router.get('/deletethekind/:_id', controller.deleteTheKind);

router.get('/profile', controller.profile);
router.get('/profile/:_id', controller.profileById);
router.get('/delete/:_id', controller.profileDelete);
router.post('/update/:_id', controller.profileUpdate);

router.get('/users', controller.users);
router.post('/users', controller.users);

module.exports = router;