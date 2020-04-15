const express = require('express')
const expressHbs = require('express-handlebars');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

//Routes Get vs POST
const routerRoutes = require('./routes/Router');
const shoesRoutes = require('./routes/shoes')

const app = express()

const PORT = process.env.PORT || 8081;
//Ket noi voi mongodb server
mongoose.connect(
    'mongodb+srv://admin:admin@cluster0-lkzza.gcp.mongodb.net/test?retryWrites=true&w=majority', { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
    err => {
        if (err) console.log('Mongoose error: ' + err)
        console.log('Mongoose successfully connected');
    }
);
app.use(morgan('dev'));
//Su dung engine la hbs
app.engine(
    '.hbs',
    expressHbs({
        defaultLayout: '',
    })
);
app.set('view engine', '.hbs');
//Lay du lieu tu form html
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
//Public thu vien
app.use(express.static('public'))
app.use('/images', express.static(__dirname + '/uploads'));
//Api
app.use('/api/shoes', shoesRoutes)
app.use('/', routerRoutes);

app.use(function(req, res, next) {
    console.log('Time:', Date.now())
    next()
});
//Server running
app.listen(PORT, () => {
    console.log(`Server at http://localhost:${PORT}`);
})