const mongoose = require('mongoose');

const chatShema = mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Error sending the text!"],
    },
    reciever_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Error sending the text!"],
    },
    text: {
        type: String,
        required: [true, "please enter some text!"]
    }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatShema);