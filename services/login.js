const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const ms = require('ms');
const User = require('../models/user');

const data = require('./userData');

router.get('/users/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.put('/block/:id', (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    { status: 'blocked' },
    (error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    }
  );
  res.send('user blocked');
});

router.put('/unblock/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, { status: 'active' }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  });
  res.send('user unblocked');
});

router.delete('/:id', async (req, res) => {
  await User.findByIdAndRemove(req.params.id);
  res.send('user deleted');
});

router.post('/login', async (req, res) => {
  const user = await data.loginUser(req.body.email, req.body.password);
  if (user && user.status == 'active') {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    User.findOneAndUpdate(
      { email: req.body.email },
      { lastLogin: new Date().toLocaleString() },
      (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log(data);
        }
      }
    );

    res.status(200).json({
      id: user.id,
      email: user.email,
      token: `${token}`,
      status: user.status,
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials or user blocked' });
  }
});

module.exports = router;
