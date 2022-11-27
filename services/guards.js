const data = require('./userData');

const adminGuard = async (req, res, next) => {
  const user = await data.getUserByEmail(req.user.email);

  if (user && user.role.toLowerCase() === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized admin' });
  }
};

module.exports = {
  adminGuard,
};
