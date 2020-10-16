const mongoose = require('mongoose');
const refreshTokenSchema = mongoose.Schema({
  user_id: { type: 'String', required: true },
  refresh_token: { type: 'String', required: true },
});
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = RefreshToken;
