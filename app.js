/**
 *  Express.js + Node.js server
 */
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const app = express();
const helmet = require('helmet');
const useragent = require('express-useragent');
const initializeCosmosDB = require('./middleware/initializeCosmosDB');
const contactFormMiddleware = require('./middleware/contactForm');
app.use(contactFormMiddleware);
app.use(initializeCosmosDB);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(useragent.express());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com https://unicons.iconscout.com/release-pro/v4.0.0/css/solid.css'],
      imgSrc: ["'self'", 'data:'],
      mediaSrc: ['https://kexp.streamguys1.com'],
      connectSrc: [
        "'self'",
        'https://api.kexp.org/v2/plays',
        'http://localhost:2000',
        'http://localhost:3000',
        'https://localhost:2000',
        'https://localhost:3000',
        'http://spacelabforever.com',
        'http://www.spacelabforever.com',
        'https://spacelabforever.com',
        'https://www.spacelabforever.com',
        'https://spacelabforever.com/admin',
        'https://www.spacelabforever.com/admin',
        'https://spacelabforever.azurewebsites.net',
        'http://spacelabforever.azurewebsites.net'
      ]
    },
  })
);

app.use(cors({
  origin: [
    'https://api.kexp.org/v2/plays',
    'https://kexp.streamguys1.com',
    'http://localhost:2000',
    'http://localhost:3000',
    'https://localhost:2000',
    'https://localhost:3000',
    'http://spacelabforever.com',
    'http://www.spacelabforever.com',
    'https://spacelabforever.com',
    'https://www.spacelabforever.com',
    'https://spacelabforever.com/admin',
    'https://www.spacelabforever.com/admin',
    'https://spacelabforever.azurewebsites.net',
    'http://spacelabforever.azurewebsites.net',
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "User-Agent"]
}));

const approvalsRouter = require('./routes/approvals/approvals');
const groupFitnessRouter = require('./routes/training/groupFitness');
const poolScheduleRouter = require('./routes/training/poolSchedule');
const blogPostsRouter = require('./routes/blog/blog');
const contactRouter = require('./routes/contact/contact');
const sensorsRouter = require('./routes/sensors/sensors');
const registerRouter = require('./routes/register');
const usersRouter = require('./routes/users/users');
const signinRouter = require('./routes/signin');
const signoutRouter = require('./routes/signout');
const refreshRouter = require('./routes/refresh');

app.use('/api', approvalsRouter);
app.use('/api', groupFitnessRouter);
app.use('/api', poolScheduleRouter);
app.use('/api', blogPostsRouter);
app.use('/api', contactRouter);
app.use('/api', sensorsRouter);
app.use('/api', registerRouter);
app.use('/api', usersRouter);
app.use('/api', signinRouter);
app.use('/api', signoutRouter);
app.use('/api', refreshRouter);
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'), (err) => {
    if (err) {
      next(err);
    }
  });
});

module.exports = app;