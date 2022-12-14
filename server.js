require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5000;

const logIn = require('./services/login');
const registerUser = require('./services/register');

require('./database');

const logger = (req, res, next) => {
  console.log(
    `${new Date().toString()} - ${req.method} ${req.path} ${req.originalUrl}`
  );
  next();
};
// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('/build'));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
//   });
// }
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logIn);
app.use(registerUser);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
