const Contact = require('../models/contactSchema');
const User = require('../models/userShema');
const asyncHandler = require('express-async-handler');

const createContact = asyncHandler( async (req, res) => {
    const contactName = req.body.name;
    const contactPhone = req.body.phone;
    const user_id = req.id;
    const user_phone = "0" + req.phone;

    console.log(user_phone, contactPhone);
    if(contactPhone === user_phone)
        return res.status(400).json({ message: "This your own number!" });

    const contactExist = await Contact.findOne({ phone: contactPhone, user_id: user_id });

    if(contactExist)
        return res.status(400).json({ message: "Contact already exist!, you can update or delete it" });

    console.log(user_id, contactName, contactPhone);

    const contact = await Contact.create({
        user_id: user_id,
        name: contactName,
        phone: contactPhone
    });

    if(contact){
        res.status(200).json(contact);
    } else {
        return res.status(400).json({ message: "Error creating contact" });
    }
});

const getContacts = asyncHandler( async (req, res) => {
    const userID = req.id;

    const contacts = await Contact.find({ user_id: userID });
    console.log(contacts);

    if(!contacts)
        return res.status(400).json({ message: "There is no contacts!" });

    const phonesArray = [];
    
    contacts.forEach(element => {
        phonesArray.push(element.phone);
    });

    console.log("this phonesArray: ", phonesArray);

    const onlineContacts = await User.find({
        phone: phonesArray,
        online: true
    });
    console.log("This online contacts: ", onlineContacts);

    const onlineContactsPhones = [];
    onlineContacts.forEach(element => {
        onlineContactsPhones.push(element.phone);
    });

    const obj = {
        contacts,
        onlineContactsPhones
    }

    res.status(200).json(obj);
});

const updateContact = asyncHandler( async (req, res) => {
    const contactName = req.body.name;
    const contactPhone = req.body.phone;
    const user_id = req.id;
    const user_phone = "0" + req.phone;

    if(contactPhone === user_phone)
        return res.status(400).json({ message: "This your own number!" });

    const updatedContact = await Contact.findOneAndUpdate({phone: contactPhone, user_id: user_id}, 
        {$set: { name: contactName }}, 
        {upsert: true});

    if(!updatedContact)
        return res.status(400).json({ message: "Error updating contact!" });

    const getUpdatedContact = await Contact.findOne({phone: contactPhone, user_id: user_id});    
    res.status(200).json(getUpdatedContact);
});

const getContact = asyncHandler( async (req, res) => {
    const contactPhone = req.body.phone;
    const user_id = req.id;
    const user_phone = "0" + req.phone;

    if(contactPhone === user_phone)
        return res.status(400).json({ message: "This your own number!" });

    const contact = await Contact.findOne({phone: contactPhone, user_id: user_id});

    if(!contact)
        return res.status(400).json({ message: "Error getting contact!" });

    res.status(200).json(contact);
});

const deleteContact = asyncHandler( async (req, res) => {
    const contactPhone = req.body.phone;
    const user_id = req.id;
    const user_phone = "0" + req.phone;

    if(contactPhone === user_phone)
        return res.status(400).json({ message: "This your own number!" });

    const contact = await Contact.deleteOne({phone: contactPhone, user_id: user_id});

    console.log(contact);
    if(contact.deletedCount !== 1)
        return res.status(400).json({ message: "Error deleting contact! or contact doesn't exist" });

    res.status(200).json({ message: "Contact deleted successfully!" });
});

module.exports = {createContact, getContacts, updateContact, getContact, deleteContact};