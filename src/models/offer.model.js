const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    product:    { type: mongoose.Schema.Types.ObjectId, 
                   ref: 'ProductDetails',
                   required: true 
            },
    
    offerAmount: { type: String, 
                   required: true 
            },
    status:     { type: String, 
                  default: 'pending'
            }
            
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);  