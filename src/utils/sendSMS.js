const twilio = require('twilio');
const dotenv = require("dotenv");
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;   
const client = twilio(accountSid, authToken);


const twilioPhoneNumber = process.env.TWILIO_PHONE ; 

module.exports = async (phoneNumber, message) => {
  try {
   
    const response = await client.messages.create({
      body: message,             
      from: twilioPhoneNumber,    
      to: phoneNumber             
    });

    console.log('SMS sent successfully:', response.sid); 
    return { success: true };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, message: 'Failed to send SMS.' };
  }
};
