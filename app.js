const express   = require('express');
const exphbs    = require('express-handlebars');
const flash     = require('connect-flash');
const session   = require('express-session');
const favicon   = require('serve-favicon');
const passport  = require('passport');
const path      = require('path');

// bring in local modules
const connectDB = require('./config/db');

// clear console
console.clear();

// configure dotenv
require('dotenv').config();

// handlebars helpers library file
helpers = require('./lib/helpers');

// passport config
require('./config/passport')(passport);

// connect to mongo database
connectDB();

// initialize app
const app = express();

// handlebars setup
var hbs = exphbs.create({
    helpers:       helpers,
    defaultLayout: 'main',
    partialsDir:   'views/partials/'
});  

// handlebars middleware
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// body parser middleware
app.use(express.urlencoded({ extended: false }));

// favicon middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// express session middleware
app.use(session({
    secret: '&%bt42hz',
    resave: true,
    saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash middleware
app.use(flash());

// global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg   = req.flash('error_msg');
    res.locals.error       = req.flash('error');
    next();
});

// dev middleware - REMOVE BEFORE DEPLOYING
app.use((req, res, next) => {
    req.user = {
        firstName: 'Bart',
        isAdmin:   true,
    }
    next();
});

// routes
app.use('/',        require('./routes/index'));
app.use('/users',   require('./routes/users'));
app.use('/logs',    require('./routes/logs'));
app.use('/sectors', require('./routes/sectors'));
app.use('/stocks',  require('./routes/stocks'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));