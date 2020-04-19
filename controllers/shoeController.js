const Shoes = require('../model/Shoes')
const TheKind = require('../model/TheKind')

//show the list of shoes
const showAll = async(req, res, next) => {
    let shoes = await Shoes.find({})
        .select('theLoai quantity _id avatar gia status name created_date')
        .populate('theLoai')
    res.send(shoes);
}

const showTheKind = async(req, res, next) => {
    let shoes = await TheKind.find({})
    res.send(shoes);
}

//show single shoes
const showOne = async(req, res, next) => {
    Shoes.findById(require('mongoose').Types.ObjectId(req.query.shoes_id),
        (err, shoes) => {
            if (err) {
                res.json({
                    result: 'failed',
                    data: [],
                    message: `Error is : ${err}`
                })
            } else {
                res.json({
                    result: 'ok',
                    data: shoes,
                    message: 'Query shoes by id successfully'
                })
            }
        })
}

//show name in names and limit
const showNL = async(req, res, next) => {
    if (!req.query.name) {
        res.json({
            result: 'failed',
            data: [],
            message: 'Input parameters is wrong!. Name must be NULL'
        })
    }
    let criteria = {
        // bat dau va cuoi phai giong database
        name: new RegExp('^' + req.query.name + '$', "i"),
        // name: new RegExp(req.query.name, "i"),
    }
    const limit = parseInt(req.query.limit > 0 ? parseInt(req.query.limit) : 100);
    Shoes.find(criteria).limit(limit).sort({ name: 1 }).select({
        avatar: 1,
        name: 1,
        theLoai: 1,
        gia: 1,
        status: 1,
        created_date: 1
    }).exec((err, shoes) => {
        if (err) {
            res.json({
                result: 'failed',
                data: [],
                message: `Error is : ${err}`
            })
        } else {
            res.json({
                result: 'ok',
                data: shoes,
                count: shoes.length,
                message: 'Query list of shoes successfully'
            })
        }
    })
}

//add new shoes
const add = async(req, res, next) => {
    let shoes = new Shoes({
        name: req.body.name,
        theLoai: req.body.theLoai,
        gia: req.body.gia,
        status: req.body.status,
    })
    if (req.file) {
        shoes.avatar = req.file.originalname
    }
    shoes.save((err) => {
        if (err) {
            res.json({
                result: 'failed',
                data: [],
                message: `Error is : ${err}`
            })
        } else {
            res.json({
                result: 'ok',
                data: {
                    avatar: req.file,
                    name: req.body.name,
                    theLoai: req.body.theLoai,
                    gia: req.body.gia,
                    status: req.body.status,
                },
                message: 'Insert new shoes successfully'
            })
        }
    })
}

//update an employee
const update = async(req, res, next) => {
    let shoesID = req.params._id

    let updateData = {
        name: req.body.name,
        theLoai: req.body.theLoai,
        gia: req.body.gia,
        status: req.body.status,
    }

    console.log(req.file)

    Shoes.findByIdAndUpdate(shoesID, { $set: updateData })
        .then(() => {
            console.log('Updated successfully')
            res.render('home')
        })
        .catch(err => {
            console.log('Updated failed', err)
        })
}

//delete new employee
const deleteOne = async(req, res, next) => {
    let shoesID = req.params._id;
    Shoes.findOneAndRemove(shoesID)
        .then(() => {
            res.json({
                message: 'Shoes deleted successfully'
            })
        })
        .catch(error => {
            res.json({
                message: 'An error occurred!'
            });
        })
}

module.exports = {
    showAll,
    showOne,
    showNL,
    add,
    update,
    deleteOne,
    showTheKind,
};