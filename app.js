const express = require('express');
const app = express();
const url = require('url');
const morgan = require('morgan');
const APIError = require('./utils/apiError');
const globalErrorHandler = require('./controllers/errorController');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')

const bodyParser = require('body-parser');
const cors = require('cors')

// Configure middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
//   next();
// });
app.use('/api',helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(morgan('dev'));
// app.use(express.json());
app.use(express.json({ limit: '2mb' }));
app.use(bodyParser.json({ limit: '5mb' }));


// const limitter = rateLimit({
//   max:10,
//   windowMs: 60*60*1000,
//   message:"Too many request  Please request again 1 hour later"
// })
// app.use(limitter);
app.use((req, res, next) => {
  req.currentTime = parseInt(new Date().getTime() / 1000);
  next();
});

//Routes
// const sample = require('./sample')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const personRouter = require('./routes/personRoutes');
const contactRouter = require('./routes/contactRoutes');


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/persons', personRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/contacts', contactRouter);

// app.use('./api/v1/sample', sample)

app.all('*', (req, res, next) => {
  next(new APIError(`Can't find ${req.originalUrl} in server plus`, 404));
});
app.use(globalErrorHandler);

//Create server
module.exports = app;

// const resetToken = crypto.randomBytes(32).toString('hex');

// passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

// console.log(passwordResetToken);
// console.log(resetToken);

// console.log(909090)
