const uuid = require('uuid/v5');

const getQueueUrl = (sqs) => {
  try {
    const urlParams = {
      QueueName: 'QUEUE_A.fifo'
    };
    
    const queueUrl = sqs.getQueueUrl(urlParams).promise();
    return queueUrl;
  } catch(e) {
    console.error(e);
  }
}

const getMessage = (sqs, queueUrl) => {
  const params = {
       AttributeNames: [
          "SentTimestamp"
       ],
       MaxNumberOfMessages: 10,
       MessageAttributeNames: [
          "All"
       ],
       QueueUrl: queueUrl,
       VisibilityTimeout: 20,
       WaitTimeSeconds: 0
      };

  return sqs.receiveMessage(params).promise();
}

const deleteMessage = (sqs, queueUrl, message) => {
  const params = {
    QueueUrl: queueUrl,
    ReceiptHandle: message.ReceiptHandle,
  }
  console.log('Deleting: ', params.ReceiptHandle);
  return sqs.deleteMessage(params).promise();
}

const sendMessage = (sqs, queueUrl, message) => {
  const params = {
  MessageAttributes: message,
  MessageGroupId: "bill",
  MessageBody: "User infor",
  MessageDeduplicationId: uuid((new Date().toString()), uuid.URL),
  QueueUrl: queueUrl
  };

  return sqs.sendMessage(params).promise();
}
module.exports = {
  getQueueUrl,
  getMessage,
  deleteMessage,
  sendMessage,
}
