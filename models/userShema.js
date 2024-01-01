const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"]
    },
    //image
    phone: {
        type: Number,
        required: [true, "Phone number is required"],
        unique: [true, "Phone already registered"]
    },
    online: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);