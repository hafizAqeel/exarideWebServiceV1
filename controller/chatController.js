var multer  = require('multer')
var upload = multer({ dest: './public/images/profileImages' });
//package for making HTTP Request
var request = require("request");
//package to generate a random number
var randomize = require('randomatic');
const { User } = require('../models/user');
const { Driver } = require('../models/driver');
const Rider  = require('../models/rider');
const Admin = require('../models/admin');
const mongoose = require('mongoose');
const express = require('express');
const logger = require('../startup/logging');

exports.sendMessageToDriver = async function(reqData,res){
    
    try{        
        logger.info('ChatController.sendMessageToDriver called  :');
        const message = reqData.message;

        const driver = await Driver.find({});
        if(!driver) return res.jsonp({ status: 'failure', message: 'Driver not found.', object: []});
        // console.log('DRIVERS LIST ******** ', driver);
        if(driver){
            for(let i = 0; i < driver.length; i++){
            
                console.log('USER ID !!!!', driver[i]._userId );
                const user = await User.findOne({ _id: driver[i]._userId });
                // if( !user ) res.jsonp({ status: 'failure', message: 'user not found', object: [] });
                console.log('USERS PHONE NUMBER FOUND', user);
                
                if(user.phone){
                    
                    let adminMessage;
                    adminMessage = "Admin message for BMS Application : " + message;
                    console.log('ADMIN MESSAGE!! ', adminMessage);   
        
                    user.message = message;
                    user.save();
        
                    console.log('Saved message', user.message);
                    
                    var headers = {
        
                        'Authorization':       'Basic ZmFsY29uLmV5ZTowMzM1NDc3OTU0NA==',
                        'Content-Type':     'application/json',
                        'Accept':       'application/json'
                    }
        
                    // Configure the request
                    var options = {
                        url: 'http://107.20.199.106/sms/1/text/single',
                        method: 'POST',
                        headers: headers,
                 
                        json: {
                            'from': 'ALDAALAH',
                             'to': user.phone,
                             'text': adminMessage
                          }
                    }
        
                    // Start the request
                    request(options, function (error, response, body) {
                        if (!error ) {
                            // Print out the response body
                            console.log(body)
                            logger.info('Sucessful Response of SMS API : ' + body );
                        }
                        else{
                            logger.info('Response/Error of SMS API : ' + error );
                        }
                    });
                    
                    logger.info('User Found with mobile number ' + user.phone );
            }
        }
    }
       
    res.jsonp({ status:"success", message:"Message sent!", object:[] });	  
    logger.info(' Exit chatController.sendMessageToDriver Method');
    }catch (err){
		logger.info('An Exception Has occured in sendMessageToDriver method' + err);
	}
}