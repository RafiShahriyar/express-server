const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    tran_id: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductDetails',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;