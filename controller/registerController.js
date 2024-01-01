const asyncHandler = require('express-async-handler');
const User = require('../models/userShema');

const registerUser = asyncHandler(async (req, res) => {
    const {username, phone} = req.body;
    if(!username || !phone)
        return res.status(400).json({message: "All fields are required"});

    const userAvailable = await User.findOne({ phone })
    if(userAvailable)
        return res.status(400).json({message: "Your phone is already registered"});

    const user = await User.create({
        username,
        phone,
        online: false
    });
    console.log(user);
    console.log(await User.findOne({ phone }));
    if(user){
        res.status(201).json({ _id: user._id, username:user.username, phone:user.phone });
    } else {
        res.status(400).json({ message: "user information are not valid!" });
    }
});

module.exports = { registerUser };