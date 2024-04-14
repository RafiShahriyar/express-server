const asyncHandler = require('express-async-handler');
const Message = require('../models/message.model');
const User = require('../models/user.model');
const Chat = require('../models/chat.model');
const Offer = require('../models/offer.model');
const mongoose = require('mongoose');

const { getRecieverSocketId, io, getSenderSocketId } = require('../socket/socket');


const sendMessage = asyncHandler(async (req, res) => {
    try {
        const {message} = req.body;
        const {id: recieverId} = req.params;
        // console.log(req.user)
        const senderId = req.user._id;  
        // console.log(senderId)
        
        let conversation = await Chat.findOne({
            users: {$all: [senderId, recieverId]}
        })

        if (!conversation) {
            conversation = await Chat.create({
                users: [senderId, recieverId]
            })
        }
        
        const newMessage = new Message({
            senderId: senderId,
            receiverId: recieverId,
            content: message
        });

        if(newMessage) {
            conversation.messages.push(newMessage);
        }


        await Promise.all([newMessage.save(), conversation.save()]);
        res.status(201).json(newMessage)

        //SOCKET IO FUNCTIONALITY
        const recieverSocketId = getRecieverSocketId(recieverId);

        if (recieverSocketId) {
            //Here we are using 
            io.to(recieverSocketId).emit('newMessage', newMessage)
        }


    } catch (error) {
        console.error(error);
        res.status(500);
        throw new Error('Error in creating message');
    }
});



const getMessages = asyncHandler(async (req, res) => {
    try {
        const {id: userToChatId} = req.params;
        // console.log(userToChatId);
        const senderId = req.user._id;
        let conversation = await Chat.findOne({
            users: {$all: [senderId, userToChatId]}
        }).populate({
            path: 'messages',
            populate: {
                path: 'offer',
                model: 'Offer',
                populate: {
                    path: 'product',
                    model: 'ProductDetails'
                }
            }
        });
        
        if (!conversation) {
            return res.json([]);
        }
        res.json(conversation.messages);

    } catch (error) {
        console.error(error);
        res.status(500);
        throw new Error('Error in fetching messages');
    }
});


const deleteMessage = asyncHandler(async (req, res) => {
    try {
        const { id: messageId } = req.params;
        console.log("messageID:",messageId);
        const message = await Message.findById(messageId);

        await Message.deleteOne({ _id: messageId })
        res.status(200).json({ message: 'Message deleted successfully' });
        //SOCKET IO FUNCTIONALITY
        console.log(message)
        const receiverSocketId = getRecieverSocketId(message.recieverId);
        const senderSocketId = getSenderSocketId(message.senderId);
        console.log('Receiver Socket ID:', receiverSocketId);
        if (receiverSocketId && senderSocketId) {
            console.log('Emitting deleteMessage event to socket:', receiverSocketId);
            io.to(receiverSocketId).emit('deleteMessage', messageId)
            io.to(senderSocketId).emit('deleteMessage', messageId)
        }
    } catch (error) {
        console.error(error);
        res.status(500);
        throw new Error('Error in deleting message');
    }
});

// const deleteOffer = asyncHandler(async (req, res) => {
//     try {
//         const { id: offerId } = req.params;
//         const objectofferId = new mongoose.Types.ObjectId(offerId);
//         await Offer.deleteOne({ _id: objectofferId });
//         res.status(200).json({ message: 'Offer deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error in deleting offer' });
//     }
// });

const updateMessage = asyncHandler(async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const { message } = req.body;
        await Message.updateOne({ _id: messageId }, { content: message });
        res.status(200).json({ message: 'Message updated successfully' });
        const content = await Message.findById(messageId);
        //SOCKET IO FUNCTIONALITY
        const receiverSocketId = getRecieverSocketId(content.recieverId);
        const senderSocketId = getSenderSocketId(message.senderId);
        if (receiverSocketId && senderSocketId) {
            io.to(receiverSocketId).emit('updateMessage', messageId, content)
            io.to(senderSocketId).emit('updateMessage', messageId, content)
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in updating message' });
    }

});


module.exports = {
    sendMessage,
    getMessages,
    deleteMessage,
    updateMessage
};