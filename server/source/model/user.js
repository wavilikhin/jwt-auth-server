const mongoose = require(`mongoose`);
const UserSchema = mongoose.Schema({
	id: { type: `String`, required: true },
	email: { type: `String`, required: true },
	password: { type: `String`, required: true },
	admin: { type: `Boolean`, default: false },
	isConfirmed: { type: `Boolean`, default: false },
});
const User = mongoose.model(`User`, UserSchema);
module.exports = { User, UserSchema };
