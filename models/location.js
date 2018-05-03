const mongoose = require('mongoose');
const Joi = require('joi');

const LocationSchema = new mongoose.Schema({

    title: String,
    loc: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d'      // create the geospatial index
    }
    
}, { timestamps: true });

function validateLocation(user) {
    const schema = {
      title: Joi.string().min(5).max(50).required()
    //   loc: Joi.number().min(2).max(20).required()
    };
  
    return Joi.validate(user, schema);
}

module.exports.validate = validateLocation; 
module.exports = mongoose.model('Location', LocationSchema);