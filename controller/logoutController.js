
const User = require('../models/userShema');
const asyncHandler = require('express-async-handler');


const logoutUser = asyncHandler(async (req, res) => {
    const loggedOutUser = await User.findOneAndUpdate({phone: req.phone}, 
        {$set: { online: false }}, 
        {upsert: true});
        console.log(loggedOutUser);
    if(loggedOutUser){
        return res.status(201).json({ message: "Logged out successfully!" });
    } else {
        return res.status(401).json({ message: "Error logging out" });
    }   
});

module.exports = { logoutUser };