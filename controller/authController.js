const asyncHandler = require('express-async-handler');
const User = require('../models/userShema');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateUser = asyncHandler(async (req, res) => {
    const {phone} = req.body;
    if(!phone)
        return res.status(400).json({message: "Phone number is required"});

    const userAvailable = await User.findOne({ phone })
    if(!userAvailable)
        return res.status(400).json({message: "Your phone is not registered"});

    if(checkPhone(phone)){
        const user = await User.findOneAndUpdate({phone: phone}, 
            {$set: { online: true }}, 
            {upsert: true});
            
        if(user){
            const accessToken = jwt.sign({
                user: {
                    username: user.username,
                    phone: user.phone,
                    id: user._id
                }
            },process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30m" }
            );
            res.status(200).json(accessToken);

        } else {
            return res.status(400).json({message: "Error in authentication process, please try again later!"});
        }
    } else {
        return res.status(400).json({message: "Your are not the owner of this phone number!"});
    }   

});

const checkPhone = (phone_number) => {
    /*
        send notification (secure random code) to phone number via 
        mobile app or website
    */
    return true;
}


module.exports = { authenticateUser };