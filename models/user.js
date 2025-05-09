const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: String,
    phoneNumber: String,
    professional: String,
    age: Number,
    city: String,
    isMarried: Boolean
});

module.exports = mongoose.model('User', userSchema);
