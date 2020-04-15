//Models
const User = require('../model/User')
const Shoes = require('../model/Shoes')
const TheKind = require('../model/TheKind')

var checkUser = {
    email: '',
    password: ''
};

const register = async(req, res) => {
    const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        pass: req.body.pass,
    })
    newUser.save(err => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('home')
        }
    })
    res.render('register')

}
const login = async(req, res) => {
    console.log('LOGIN')
    res.render('login')
};

const err = (req, res) => {
    checkUser = {
        email: req.body.email,
        password: req.body.password
    }
    if (checkUser.username == 'lcoder@gmail.com' || checkUser.password == 123) {
        res.writeHead(301, { Location: 'http://' + req.headers['host'] + '/' });
        res.end();
    } else {
        res.render('login')
    }
};

const index = async(req, res) => {
    let theKind = await TheKind.find().lean();
    console.log(theKind._id)
        // let shoes = await Shoes.find({ theLoai: theKind._id })
        //     .populate({ path: 'theLoai', selected: "name" })
        //     .lean();
    let shoes = await Shoes.find().lean();
    console.log(shoes)

    if (checkUser.email == '' || checkUser.password == '') {
        res.writeHead(301, { Location: 'http://' + req.headers['host'] + '/login' });
        res.end();
    } else {
        res.render('home', { shoes: shoes });
    }
};
const createIndex = async(req, res) => {
    let shoes = await new Shoes({
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
            console.log('Save error', err)
        } else {
            console.log('Save success')
            res.writeHead(301, { Location: 'http://' + req.headers['host'] + '/' });
            res.end();
        }
    })
};

const editShoesById = (req, res) => {
    console.log('EDIT SHOES ID')
    try {
        Shoes.findOne({ _id: req.params._id }, (err, shoes) => {
            res.render('editShoes', {
                shoes: shoes
            })
            console.log(shoes)
        }).lean();
    } catch (error) {
        console.log(error)
    }
};
const editShoes = (req, res) => {
    console.log('EDIT SHOES')
    let id = req.params._id

    let updateData = {
        name: req.body.name,
        theLoai: req.body.theLoai,
        gia: req.body.gia,
        status: req.body.status,
    }

    console.log(req.file)

    Shoes.findByIdAndUpdate(id, { $set: updateData })
        .then(() => {
            console.log('Updated successfully')
            res.writeHead(301, { Location: 'http://' + req.headers['host'] + '/' });
            res.end();
        })
        .catch(err => {
            console.log('Updated failed', err)
        })
};
const deleteShoes = (req, res) => {
    let id = req.params._id;
    Shoes.findOneAndRemove(id)
        .then(() => {
            console.log('Delete successfully')
            res.writeHead(301, { Location: 'http://' + req.headers['host'] + '/' });
            res.end();
        })
        .catch(error => {
            console.log('Delete failed', error)
        })
};
const shoes = async(req, res) => {
    let thekind = await TheKind.find().lean();
    res.render('shoes', { theKind: thekind });
};

const thekind = async(req, res) => {
    let thekind = await TheKind.find().lean();
    res.render('theKind', { theKind: thekind });

};
const createTheKind = async(req, res) => {
    let theKind = await new TheKind({
        name: req.body.name,
    })
    theKind.save((err) => {
        if (err) {
            console.log('Save error', err);
        } else {
            console.log('Save success')
            res.writeHead(301, { Location: 'http://' + req.headers['host'] + '/theKind' });
            res.end();
        }
    })
}
const updateTheKind = async(req, res) => {
    const id = req.params._id;
    let updateData = { name: req.body.name, }

    TheKind.findByIdAndUpdate(id, { $set: updateData })
        .then(data => {
            console.log('Updated data', data);
        })
        .catch(err => {
            console.log('Updated data failed', err);
        })
}
const deleteTheKind = async(req, res) => {

    TheKind.findByIdAndRemove({ _id: req.params._id })
        .then(() => {
            console.log('Delete successfully');
            res.writeHead(301, { Location: 'http://' + req.headers['host'] + '/thekind' });
            res.end();
        })
        .catch(error => {
            console.log('Delete failed', error);
        })
}

const profile = (req, res) => {
    res.render('profile')
}
const profileById = async(req, res) => {
    try {
        User.findOne({ _id: req.params._id }, (err, users) => {
            res.render('profile', {
                users: users
            })
            console.log(users)
        }).lean();
    } catch (error) {
        console.log(error)
    }
}
const profileDelete = async(req, res) => {
    User.findByIdAndRemove({ _id: req.params._id })
        .then(() => {
            res.json({
                message: 'Employee deleted successfully'
            })
        })
        .catch(error => {
            res.json({
                message: 'An error occurred!'
            });
        })
};
const profileUpdate = async(req, res) => {
    let updateData = {
        name: req.body.name,
        email: req.body.email
    }
    User.findByIdAndUpdate({ _id: req.params._id }, { $set: updateData })
        .then(() => {
            res.json({
                data: updateData,
                message: 'User update successfully'
            })
        })
        .catch(() => {
            res.json({
                message: 'An error occurred!',
            });
        })
};

const users = async(req, res) => {
    await User.find({}, (err, users) => {
        res.render('users', {
            users: users
        })
    }).lean();
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
}