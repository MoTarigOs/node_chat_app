const asyncHandler = require('express-async-handler');
const User = require('../models/userShema');
const Chat = require('../models/chatShema');

const createChat = asyncHandler( async (req, res) => {
    const sender_id = req.id;
    const recieverPhone = req.body.phone;
    const senderPhone = req.phone;

    if(senderPhone === recieverPhone)
        return res.status(400).json({ message: "Can't send text to your self!" });

    const reciever = await User.findOne({ phone: recieverPhone });
    if(!reciever)
        return res.status(400).json({ message: "This number not exist!" });
    const reciever_id = reciever.id;

    if(reciever_id === sender_id)
        return res.status(400).json({ message: "Can't send text to your self!" });

    const text = req.body.text;

    const chat = await Chat.create({
        sender_id,
        reciever_id,
        text,
    });

    if(chat){
        res.status(200).json({ message: "Text sended successfully!" })
    } else {
        res.status(401).json({ message: "Error sending text" });
    }
});

const getChats = asyncHandler(async (req, res) => {
    const sender_id = req.id;
    const senderPhone = req.phone;
    const recieverPhone = req.body.phone;

    if(senderPhone === recieverPhone)
        return res.status(400).json({ message: "Can't send text to your self!" });

    const reciever = await User.findOne({phone: recieverPhone});
    if(!reciever)
        return res.status(400).json({ message: "This number not exist!" });
    const reciever_id = reciever.id;

    if(reciever_id === sender_id)
        return res.status(400).json({ message: "Can't send text to your self!" });

    const chats = await Chat.find({sender_id: sender_id, reciever_id: reciever_id});    
    if(chats){
        res.status(200).json(chats);
    } else {
        res.status(401).json({ message: "Error sending text" });
    }
});

const deleteChat = asyncHandler( async (req, res) => {
    const sender_id = req.id;
    const senderPhone = req.phone;
    const recieverPhone = req.body.phone;
    const deletedChatID = req.body.id;

    if(senderPhone === recieverPhone)
        return res.status(400).json({ message: "There is no chats!" });

    const reciever = await User.findOne({phone: recieverPhone});
    if(!reciever)
        return res.status(400).json({ message: "This number not exist!" });
    const reciever_id = reciever.id;

    if(reciever_id === sender_id)
        return res.status(400).json({ message: "There is no chats!" });

    const deletedChat = await Chat.deleteOne({ _id: deletedChatID });    
    if(deletedChat){
        res.status(200).json({ message: "Chat had been deleted!" });
    } else {
        res.status(401).json({ message: "Error deleting text" });
    }
});

module.exports = { createChat, getChats, deleteChat };