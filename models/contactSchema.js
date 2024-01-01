const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    user_id: {  //the id of user who creates contact
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Something gone wrong!"]
    },
    name: {
        type: String,
        required: [true, "Please give the contact a name"]
    },
    phone: {
        type: Number,
        required: [true, "Please give the contact a phone number"]
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model('Contact', contactSchema);