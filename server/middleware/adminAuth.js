// Middleware to check if a user is an admin
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. You must be an admin.' });
    }
  }

  module.exports = isAdmin;