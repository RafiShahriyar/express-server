const express = require("express");
const router = express.Router();

// Import the product model
const { ObjectId } = require('mongodb');
const Order = require('../models/order.model');
const ProductDetails = require('../models/product.model');


//sslcommerz init
const SSLCommerzPayment = require('sslcommerz-lts')
const store_id = "compu6606940f4622d"
const store_passwd = "compu6606940f4622d@ssl"
const is_live = false //true for live, false for sandbox

// transaction_id
const tran_id = new ObjectId().toString();



// Handle order
router.post('/order', async(req, res) => {
    const { userId, userName, products } = req.body;
    console.log(userId, userName, products);
    const tran_id = new ObjectId().toString();
    // Calculate total price
    const totalPrice = products.reduce((acc, product) => {
        // Convert price to number and add to accumulator
        return acc + (parseInt(product.price) * product.quantity);
    }, 0);
    const data = {
        total_amount: totalPrice,
        currency: 'BDT',
        tran_id: tran_id, // use unique tran_id for each api call
        success_url: `http://localhost:5000/api/payment/success/${tran_id}`,
        fail_url: `http://localhost:5000/api/payment/fail/${tran_id}`,
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3000/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: userName,
        cus_id: userId,
        cus_email: 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };

    // Create an instance of SSLCommerzPayment
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL;
        console.log('Redirecting to: ', GatewayPageURL);
        res.send({ url: GatewayPageURL });


        // Optionally, you can save the order details here before redirection
        const finalOrder = new Order({ 
            userId: userId,
            userName: userName,
            totalPrice: totalPrice,
            tran_id: tran_id,
            status: 'Pending',
            products: products.map(product => ({ productId: product._id, quantity: product.quantity }))
        });
        finalOrder.save().then(savedOrder => {
            console.log('Order saved:', savedOrder);
        }).catch(err => {
            console.error('Error saving order:', err);
        });
    });
});

    router.post("/success/:transactionId", async (req, res,next) => {
        console.log(req.params.transactionId)
        const savedOrder = await Order.findOneAndUpdate(
            { tran_id: req.params.transactionId },
            { $set: { status: 'Success' } }
        ).populate('products.productId');

        if (savedOrder) {
            // Update the stock for each product in the order
            for (const product of savedOrder.products) {
                // Update the product's stock
                await ProductDetails.updateOne({ _id: product.productId._id }, { $inc: { stock: -product.quantity } });
            }
            console.log("Order status updated successfully.")
            res.redirect(`http://localhost:3000/payment/success/${req.params.transactionId}`);
        }
        else {
            res.status(500).send("Failed to update order status.");
        };



    });
 
    router.post("/fail/:transactionId", async (req, res) => {
        try {
            // Get the transaction ID from the request body
            const { transactionId } = req.params;
    
            // Find and delete the order from the database based on the transaction ID
            const deletedOrder = await Order.findOneAndDelete({ tran_id: transactionId });
            
            if (deletedOrder) {
                console.log("Order deleted successfully.");
                res.redirect(`http://localhost:3000/payment/fail/${transactionId}`);
            } else {
                console.log("Order not found or already deleted.");
                res.redirect(`http://localhost:3000/payment/fail/${transactionId}`);
            }
        } catch (error) {
            console.error("Error deleting order:", error);
            res.status(500).send("Failed to delete order.");
        }
    });







module.exports = router;