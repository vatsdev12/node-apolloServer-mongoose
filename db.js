const userModel = require('./models/users');
const feedModel = require('./models/feeds')

module.exports = {
  feeds: feedModel,
  users: userModel
};
