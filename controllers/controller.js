//Models
const User = require('../model/User');
const Shoes = require('../model/Shoes');
const TheKind = require('../model/TheKind');

var checkUser = {
    email: null,
    password: null,
};

const register = async(req, res) => {
    res.render('register');

}
const registerPost = async(req, res) => {
    const newUser = await new User({
        email: req.body.email,
        name: req.body.name,
        pass: req.body.pass,
    });
    newUser.save((err) => {
        if (err) {
            console.log('Add failed', err);
            res.redirect('/register');
        } else {
            console.log('Add successfully');
            res.redirect('/users');
        }
    });
};
const login = (req, res) => {
    res.render('login');
};

const err = async(req, res) => {
    let user = await User.findOne({
        email: req.body.email,
        pass: req.body.password,
    }).then(user => {
        console.log(user)
        checkUser = {
            email: user.email,
            password: user.pass,
        };
        res.redirect('/');
    }).catch(err => {
        res.redirect('/login');
    })
};

const index = async(req, res) => {
    let shoes = await Shoes.find({})
        .select('theLoai quantity _id avatar gia status name created_date')
        .populate('theLoai')
        .lean();
    if (checkUser.email == null || checkUser.password == null) {
        res.redirect('/login');
    } else {
        res.render('home', { shoes: shoes });
    }
};
const createIndex = async(req, res) => {
    var errors=[];
    if(!req.body.name){
        errors.push('Name is required');
    }
    if(!req.file){
        errors.push('Image is required');
    }
    if(errors.length){
        let thekind = await TheKind.find().lean();
		res.render('shoes', { theKind: thekind, errors: errors });
        console.log(errors)
        return;
    }

    let shoes = await new Shoes({
        name: req.body.name,
        theLoai: req.body.theLoai,
        gia: req.body.gia,
        status: req.body.status,
    });
    if (req.file) {
        shoes.avatar = req.file.originalname;
    }
    shoes.save((err) => {
        if (err) {
            console.log('Save error', err);
        } else {
            console.log('Save success');
            res.redirect('/');
        }
    });
};

const editShoesById = async(req, res) => {
    let shoes = await Shoes.findOne({ _id: req.params._id }).lean();
    let theLoai = await TheKind.findOne({ _id: shoes.theLoai._id }).lean();
    let theKind = await TheKind.find().lean();

    try {
        res.render('editShoes', {
            shoes: shoes,
            theLoai: theLoai,
            theKind: theKind,
        });
    } catch (error) {
        console.log(error);
    }
};
const editShoes = (req, res) => {
    let id = req.params._id;
    let updateData;
    if (req.file) {
        updateData = {
            avatar: req.file.originalname,
            name: req.body.name,
            theLoai: req.body.theLoai,
            gia: req.body.gia,
            status: req.body.status,
        };
    } else {
        updateData = {
            name: req.body.name,
            theLoai: req.body.theLoai,
            gia: req.body.gia,
            status: req.body.status,
        };
    }

    Shoes.findByIdAndUpdate(id, { $set: updateData })
        .then(() => {
            console.log('Updated successfully');
            res.redirect('/');
        })
        .catch((err) => {
            console.log('Updated failed', err);
        });
};
const deleteShoes = (req, res) => {
    let id = req.params._id;
    Shoes.findByIdAndDelete(id)
        .then(() => {
            console.log('Delete successfully');
            res.redirect('/');
        })
        .catch((error) => {
            console.log('Delete failed', error);
        });
};
const shoes = async(req, res) => {
    let thekind = await TheKind.find().lean();
    res.render('shoes', { theKind: thekind });
};

const thekind = async(req, res) => {
    if (checkUser.email != null || checkUser.password != null) {
        let thekind = await TheKind.find().lean();
        res.render('theKind', { theKind: thekind });
    } else {
        res.redirect('/login')
    }
};
const createTheKind = async(req, res) => {

    let theKind = await new TheKind({
        name: req.body.name,
    });
    theKind.save((err) => {
        if (err) {
            console.log('Save error', err);
        } else {
            console.log('Save success');
            res.redirect('/theKind');
        }
    });
};
const updateTheKind = async(req, res) => {
    const id = req.params._id;
    let theKind = await TheKind.findOne({ _id: id }).lean();
    let updateData = { name: req.body.name };

    TheKind.findByIdAndUpdate(id, { $set: updateData })
        .then((data) => {
            res.redirect('/thekind');
        })
        .catch((err) => {
            console.log('Updated data failed', err);
            res.redirect('/thekind');
        });
};
const deleteTheKind = async(req, res) => {
    TheKind.findByIdAndRemove({ _id: req.params._id })
        .then(() => {
            console.log('Delete successfully');
            res.redirect('/theKind');
        })
        .catch((error) => {
            console.log('Delete failed', error);
        });
};

const profile = (req, res) => {
    if (checkUser.email != null || checkUser.password != null) {
        res.render('profile');
    } else {
        res.redirect('/login')
    }
};
const profileById = async(req, res) => {
    try {
        User.findOne({ _id: req.params._id }, (err, users) => {
            res.render('profile', {
                users: users,
            });
            console.log(users);
        }).lean();
    } catch (error) {
        console.log(error);
    }
};
const profileDelete = async(req, res) => {
    User.findByIdAndRemove({ _id: req.params._id })
        .then(() => {
            console.log('Delete successfully');
            res.redirect('/users')
        })
        .catch((error) => {
            console.log('Delete failed', error);
        });
};
const profileUpdate = async(req, res) => {
    let updateData = {
        name: req.body.name,
        email: req.body.email,
        pass: req.body.pass,
    };
    User.findByIdAndUpdate({ _id: req.params._id }, { $set: updateData })
        .then(() => {
            console.log('Update successfully')
            res.redirect('/users')
        })
        .catch((error) => {
            console.log('Delete failed', error);
        });
};

const users = async(req, res) => {
    if (checkUser.email != null || checkUser.password != null) {
        let user = await User.find({}).lean();
        res.render('users', {
            users: user,
        })
    } else {
        res.redirect('/login')
    }
};

module.exports = {
    register,
    login,
    err,
    index,
    createIndex,
    shoes,
    thekind,
    createTheKind,
    updateTheKind,
    deleteTheKind,
    editShoesById,
    editShoes,
    deleteShoes,
    profile,
    profileById,
    profileDelete,
    profileUpdate,
    users,
    registerPost,
};