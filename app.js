const express = require('express');
const mongoose = require('express')
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const connectDB = require('./config/db');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');



//Load Config
dotenv.config({ path: './config/config.env' });

//passport Config
require('./config/passport')(passport);

connectDB();

const app = express();

//Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//logging in dev mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//handlebars helpers
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs');

// handlebars 
app.engine(
  '.hbs', 
  exphbs.engine({helpers: {
    formatDate,
    truncate,
    editIcon,
    select,
    stripTags,},
    defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// sessions 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  storeUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI //URI From MongoDB Atlas
   }) 
  }))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

//static folders
app.use(express.static(`${__dirname}/public`));

//routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));