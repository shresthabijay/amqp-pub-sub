const AWS = require('../aws')
const sns = new AWS.SNS();

sns.setSMSAttributes({
    attributes: { DefaultSMSType: "Transactional" }
}, err => console.log)

exports.sendSMS = async ({ phoneNumber, body }) => {
    console.log(`Sending SMS. Phone: ${phoneNumber}, body: ${body}`);
    const params = {
        Message: body,
        MessageStructure: 'string',
        PhoneNumber: phoneNumber
    };
    return sns.publish(params).promise();
}