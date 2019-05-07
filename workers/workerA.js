// Load the SDK for JavaScript
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const utils = require('../src/sqs-utils');
dotenv.config();
// Set the region 
AWS.config.update({region: 'us-east-2',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
const App = async () => {

  try{
    const sqsSdk = new AWS.SQS({apiVersion: '2012-11-05'});
    const url = await utils.getQueueUrl(sqsSdk);  
    const payload = await utils.getMessage(sqsSdk, url.QueueUrl);
    if(payload.Messages){
      const messagesToDelete = payload.Messages.map((message) => {
        const obj = {};
        obj.bill_id = parseInt(message.MessageAttributes['bill_id']['StringValue']);
        obj.user_id = parseInt(message.MessageAttributes['user_id']['StringValue']);
        obj.date = Date.parse(message.MessageAttributes['date']['StringValue']);
        console.log("Printing message...");
        console.log(obj);
        return utils.deleteMessage(sqsSdk, url.QueueUrl, payload.Messages[0]);
      })
      await Promise.all(messagesToDelete);
    } else {
      console.log("No messages found");
    }
  } catch (e) {
    console.error(e);
  }
}

setInterval(() => App(), 3000);
