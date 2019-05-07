// Load the SDK for JavaScript
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const sqs = require('./sqs-utils');
dotenv.config();
// Set the region 
AWS.config.update({region: 'us-east-2',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
const App = async () => {
  // Create message object
  const messageObject = {
    user_id: { DataType: 'Number',
      StringValue: '1' },
    bill_id: { DataType: 'Number',
      StringValue: '9' },
    date: { DataType: 'String',
      StringValue: new Date().toString() },
  }
  // Create an SQS service object
  const sqsSdk = new AWS.SQS({apiVersion: '2012-11-05'});
  const url = await sqs.getQueueUrl(sqsSdk);  
  const messageResult = await sqs.sendMessage(sqsSdk, url.QueueUrl, messageObject);
  console.log(messageResult);

}
App();
